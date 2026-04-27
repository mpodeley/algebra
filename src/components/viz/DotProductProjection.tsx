import { useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import {
  Arrow,
  Arrowhead,
  Handle,
  clampToDomain,
  fmt,
  pointerToData,
  type Vec,
} from './primitives'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-3.5, 3.5]
const TICKS = [-3, -2, -1, 1, 2, 3]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const V_COLOR = VIZ.blue
const W_COLOR = VIZ.coral
const PROJ_POS = VIZ.teal
const PROJ_NEG = VIZ.coral

type Which = 'v' | 'w'

export function DotProductProjection() {
  const [v, setV] = useState<Vec>({ x: 2, y: 1.5 })
  const [w, setW] = useState<Vec>({ x: 2.5, y: 0.4 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const dot = v.x * w.x + v.y * w.y
  const wNormSq = w.x * w.x + w.y * w.y
  const wNorm = Math.sqrt(wNormSq)
  const vNorm = Math.hypot(v.x, v.y)
  const cosTheta = vNorm * wNorm > 0 ? dot / (vNorm * wNorm) : 0
  const cosClamped = Math.max(-1, Math.min(1, cosTheta))
  const thetaDeg = (Math.acos(cosClamped) * 180) / Math.PI

  const projVec: Vec =
    wNormSq > 1e-6
      ? { x: (dot / wNormSq) * w.x, y: (dot / wNormSq) * w.y }
      : { x: 0, y: 0 }
  const projColor = dot >= 0 ? PROJ_POS : PROJ_NEG

  function startDrag(which: Which, e: PointerEvent<SVGCircleElement>) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setActive(which)
  }
  function moveDrag(e: PointerEvent<SVGSVGElement>) {
    if (!active) return
    const p = clampToDomain(
      pointerToData(svgRef.current, e, SIZE, xScale, yScale),
      DOMAIN,
    )
    if (active === 'v') setV(p)
    else setW(p)
  }
  function endDrag() {
    setActive(null)
  }

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto aspect-square w-full max-w-[480px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-full w-full touch-none select-none"
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            <Arrowhead id="dp-v" color={V_COLOR} />
            <Arrowhead id="dp-w" color={W_COLOR} />
            <Arrowhead id="dp-proj" color={projColor} />
            <clipPath id="dp-clip">
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

          {/* extended line through origin in direction of w (dashed) */}
          {wNormSq > 1e-6 && (
            <g clipPath="url(#dp-clip)">
              <line
                x1={xScale(-100 * w.x)}
                y1={yScale(-100 * w.y)}
                x2={xScale(100 * w.x)}
                y2={yScale(100 * w.y)}
                stroke={W_COLOR}
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="3 4"
              />
            </g>
          )}

          {/* projection arrow on the line of w */}
          {wNormSq > 1e-6 && (
            <Arrow
              head={projVec}
              color={projColor}
              markerId="dp-proj"
              xs={xScale}
              ys={yScale}
              opacity={0.85}
              width={3.5}
            />
          )}

          {/* perpendicular from v to projection foot */}
          {wNormSq > 1e-6 && (
            <line
              x1={xScale(v.x)}
              y1={yScale(v.y)}
              x2={xScale(projVec.x)}
              y2={yScale(projVec.y)}
              stroke={VIZ.mute}
              strokeOpacity={0.55}
              strokeWidth={1}
              strokeDasharray="2 4"
            />
          )}

          {/* w arrow */}
          <Arrow
            head={w}
            color={W_COLOR}
            markerId="dp-w"
            xs={xScale}
            ys={yScale}
          />
          {/* v arrow */}
          <Arrow
            head={v}
            color={V_COLOR}
            markerId="dp-v"
            xs={xScale}
            ys={yScale}
          />

          {/* handles */}
          <Handle
            x={xScale(v.x)}
            y={yScale(v.y)}
            color={V_COLOR}
            label="v"
            active={active === 'v'}
            onPointerDown={(e) => startDrag('v', e)}
          />
          <Handle
            x={xScale(w.x)}
            y={yScale(w.y)}
            color={W_COLOR}
            label="w"
            active={active === 'w'}
            onPointerDown={(e) => startDrag('w', e)}
          />
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] space-y-2">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <span className="font-mono text-[12px] text-mute">v · w</span>
          <span
            className="font-serif text-[28px] tabular-nums"
            style={{ color: dot < 0 ? PROJ_NEG : VIZ.ink }}
          >
            {dot.toFixed(2)}
          </span>
        </div>

        <p className="font-mono text-[11px] leading-snug text-mute">
          coordinates: ({fmt(v.x)})({fmt(w.x)}) + ({fmt(v.y)})({fmt(w.y)}){' '}
          = <span style={{ color: VIZ.ink }}>{dot.toFixed(2)}</span>
        </p>
        <p className="font-mono text-[11px] leading-snug text-mute">
          geometry: |v|·|w|·cosθ = {vNorm.toFixed(2)} · {wNorm.toFixed(2)} ·{' '}
          {cosClamped.toFixed(3)} ={' '}
          <span style={{ color: VIZ.ink }}>
            {(vNorm * wNorm * cosClamped).toFixed(2)}
          </span>{' '}
          (θ ≈ {thetaDeg.toFixed(0)}°)
        </p>
        {dot < 0 ? (
          <p className="text-[12px] text-mute">
            v and w point on opposite sides; the projection points back
            along w.
          </p>
        ) : Math.abs(dot) < 0.05 ? (
          <p className="text-[12px] text-mute">
            v and w are perpendicular; the projection has zero length.
          </p>
        ) : null}
      </div>
    </figure>
  )
}
