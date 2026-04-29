import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'
import {
  Arrow,
  Arrowhead,
  Handle,
  clampToDomain,
  pointerToData,
  type Vec,
} from './primitives'

const PHI = (1 + Math.sqrt(5)) / 2
// PSI = -1/PHI ≈ -0.618 — the second eigenvalue, used implicitly via the
// (1, -PHI) eigenvector direction.

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-3, 3]
const TICKS = [-2, -1, 1, 2]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const PHI_COLOR = VIZ.amber
const PSI_COLOR = VIZ.purple
const TRAIL_COLOR = VIZ.teal
const V0_COLOR = VIZ.blue

// Unit-length eigenvectors of F.
const E_PHI: Vec = (() => {
  const n = Math.hypot(PHI, 1)
  return { x: PHI / n, y: 1 / n }
})()
const E_PSI: Vec = (() => {
  const n = Math.hypot(1, PHI)
  return { x: 1 / n, y: -PHI / n }
})()

function applyF(v: Vec): Vec {
  return { x: v.x + v.y, y: v.x }
}

const N_MAX = 24

export function FibonacciGolden() {
  const [v0, setV0] = useState<Vec>({ x: 1, y: 0 })
  const [n, setN] = useState(8)
  const [active, setActive] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // Iterates F^k v0 for k = 0..N_MAX, then rescaled by φ^(-k).
  const { iterates, rescaled } = useMemo(() => {
    const its: Vec[] = [{ x: v0.x, y: v0.y }]
    for (let k = 0; k < N_MAX; k++) {
      its.push(applyF(its[k]))
    }
    const rsc = its.map((p, k) => ({
      x: p.x / Math.pow(PHI, k),
      y: p.y / Math.pow(PHI, k),
    }))
    return { iterates: its, rescaled: rsc }
  }, [v0])

  const current = iterates[Math.min(n, N_MAX)]
  const currentScaled = rescaled[Math.min(n, N_MAX)]

  // Decompose v0 in the eigenbasis (φ, 1) and (1, -φ): v0 = a·u₁ + b·u₂
  // Solving with u₁ = (φ, 1), u₂ = (1, -φ):
  //   a = (φ·v0.x + v0.y) / (φ² + 1)
  //   b = (v0.x - φ·v0.y) / (φ² + 1)
  const denom = PHI * PHI + 1
  const aPhi = (PHI * v0.x + v0.y) / denom
  // The limit point of the rescaled iterates: a · (φ, 1)
  const limit: Vec = { x: aPhi * PHI, y: aPhi * 1 }

  // For the readout: ratio of consecutive components — should approach φ.
  const ratio =
    Math.abs(iterates[Math.min(n, N_MAX) - 1]?.x ?? 1) > 1e-9
      ? iterates[Math.min(n, N_MAX)].x /
        iterates[Math.min(n, N_MAX) - 1].x
      : NaN

  function startDrag(e: PointerEvent<SVGCircleElement>) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setActive(true)
  }
  function moveDrag(e: PointerEvent<SVGSVGElement>) {
    if (!active) return
    const p = clampToDomain(
      pointerToData(svgRef.current, e, SIZE, xScale, yScale),
      DOMAIN,
    )
    setV0(p)
  }
  function endDrag() {
    setActive(false)
  }

  function setFibonacciSeed() {
    setV0({ x: 1, y: 0 })
  }

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
        <div className="aspect-square w-full">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block h-full w-full touch-none select-none"
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <defs>
              <Arrowhead id="fg-v0" color={V0_COLOR} />
              <clipPath id="fg-clip">
                <rect
                  x={PAD}
                  y={PAD}
                  width={SIZE - 2 * PAD}
                  height={SIZE - 2 * PAD}
                />
              </clipPath>
            </defs>

            {/* faint grid */}
            {TICKS.map((t) => (
              <line
                key={`vx${t}`}
                x1={xScale(t)}
                x2={xScale(t)}
                y1={yScale(DOMAIN[0])}
                y2={yScale(DOMAIN[1])}
                stroke={VIZ.line}
                strokeWidth={1}
              />
            ))}
            {TICKS.map((t) => (
              <line
                key={`hy${t}`}
                y1={yScale(t)}
                y2={yScale(t)}
                x1={xScale(DOMAIN[0])}
                x2={xScale(DOMAIN[1])}
                stroke={VIZ.line}
                strokeWidth={1}
              />
            ))}

            {/* axes */}
            <line
              x1={xScale(DOMAIN[0])}
              x2={xScale(DOMAIN[1])}
              y1={yScale(0)}
              y2={yScale(0)}
              stroke={VIZ.lineStrong}
              strokeWidth={1.25}
            />
            <line
              y1={yScale(DOMAIN[0])}
              y2={yScale(DOMAIN[1])}
              x1={xScale(0)}
              x2={xScale(0)}
              stroke={VIZ.lineStrong}
              strokeWidth={1.25}
            />

            {/* eigenvector lines through origin */}
            <g clipPath="url(#fg-clip)">
              <line
                x1={xScale(-100 * E_PHI.x)}
                y1={yScale(-100 * E_PHI.y)}
                x2={xScale(100 * E_PHI.x)}
                y2={yScale(100 * E_PHI.y)}
                stroke={PHI_COLOR}
                strokeWidth={2.5}
                strokeOpacity={0.8}
              />
              <line
                x1={xScale(-100 * E_PSI.x)}
                y1={yScale(-100 * E_PSI.y)}
                x2={xScale(100 * E_PSI.x)}
                y2={yScale(100 * E_PSI.y)}
                stroke={PSI_COLOR}
                strokeWidth={1.75}
                strokeOpacity={0.7}
                strokeDasharray="4 4"
              />
              <text
                x={xScale(2.6 * E_PHI.x)}
                y={yScale(2.6 * E_PHI.y)}
                fill={PHI_COLOR}
                fontSize={12}
                fontFamily="var(--font-mono), monospace"
              >
                λ = φ
              </text>
              <text
                x={xScale(2.4 * E_PSI.x)}
                y={yScale(2.4 * E_PSI.y) + 14}
                fill={PSI_COLOR}
                fontSize={12}
                fontFamily="var(--font-mono), monospace"
              >
                λ = −1/φ
              </text>
            </g>

            {/* limit point */}
            <circle
              cx={xScale(limit.x)}
              cy={yScale(limit.y)}
              r={6}
              fill={PHI_COLOR}
              fillOpacity={0.18}
              stroke={PHI_COLOR}
              strokeWidth={1.25}
              strokeDasharray="2 2"
            />

            {/* rescaled trail w_k = F^k v0 / φ^k  — converges to (a·φ, a) */}
            <g clipPath="url(#fg-clip)">
              {/* connecting polyline */}
              <polyline
                points={rescaled
                  .slice(0, n + 1)
                  .map((p) => `${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
                  .join(' ')}
                fill="none"
                stroke={TRAIL_COLOR}
                strokeOpacity={0.4}
                strokeWidth={1}
              />
              {/* the dots */}
              {rescaled.slice(0, n + 1).map((p, k) => {
                const isLast = k === n
                return (
                  <circle
                    key={k}
                    cx={xScale(p.x)}
                    cy={yScale(p.y)}
                    r={isLast ? 5 : 2.5}
                    fill={TRAIL_COLOR}
                    fillOpacity={isLast ? 1 : 0.4 + (k / Math.max(1, n)) * 0.5}
                  />
                )
              })}
            </g>

            {/* v0 arrow */}
            <Arrow
              head={v0}
              color={V0_COLOR}
              markerId="fg-v0"
              xs={xScale}
              ys={yScale}
              width={2}
              opacity={0.85}
            />
            <Handle
              x={xScale(v0.x)}
              y={yScale(v0.y)}
              color={V0_COLOR}
              label="v₀"
              active={active}
              onPointerDown={startDrag}
            />
          </svg>
        </div>

        <Slider
          label="iterations n"
          min={0}
          max={N_MAX}
          step={1}
          value={n}
          onChange={(next) => setN(Math.round(next))}
          display={`n = ${n}`}
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={setFibonacciSeed}
            className="rounded-(--radius-button) border border-line px-2.5 py-1 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            v₀ ← (1, 0)
          </button>
          <p className="font-mono text-[11px] text-mute">
            φ = {PHI.toFixed(7)}
          </p>
        </div>

        <div className="rounded-(--radius-card) border border-line bg-surface px-3 py-2.5">
          <p className="font-mono text-[11px] leading-snug text-mute">
            <span className="text-ink">Fⁿv₀</span> = ({current.x.toFixed(3)},{' '}
            {current.y.toFixed(3)})
            {' · |Fⁿv₀| = '}
            {Math.hypot(current.x, current.y).toFixed(3)}
          </p>
          <p className="mt-1 font-mono text-[11px] leading-snug text-mute">
            <span className="text-ink">Fⁿv₀ / φⁿ</span> ={' '}
            ({currentScaled.x.toFixed(4)}, {currentScaled.y.toFixed(4)}){' '}
            <span style={{ color: PHI_COLOR }}>→ ({limit.x.toFixed(4)},{' '}
            {limit.y.toFixed(4)})</span>
          </p>
          {Number.isFinite(ratio) && n > 0 && (
            <p className="mt-1 font-mono text-[11px] leading-snug text-mute">
              <span className="text-ink">(Fⁿv₀)ₓ / (Fⁿ⁻¹v₀)ₓ</span> ={' '}
              {ratio.toFixed(6)}{' '}
              <span style={{ color: PHI_COLOR }}>→ {PHI.toFixed(6)}</span>
            </p>
          )}
        </div>
      </div>
    </figure>
  )
}
