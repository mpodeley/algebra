import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { eigen, type Vec2 } from '../../lib/math/eigen'
import {
  Arrow,
  Arrowhead,
  Handle,
  clampToDomain,
  pointerToData,
  type Vec,
} from './primitives'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-3.5, 3.5]
const TICKS = [-3, -2, -1, 1, 2, 3]
const GRID = 3

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral
const EIGEN_COLOR_1 = VIZ.amber
const EIGEN_COLOR_2 = VIZ.purple

type Which = 'i' | 'j'

/**
 * Drag î and ĵ; the matrix [î | ĵ] has its eigenvalues and eigenvectors
 * computed in real time. Real eigenvectors are drawn as bold lines
 * through the origin — these are the directions whose vectors get
 * scaled but not rotated. When the eigenvalues are complex (rotational
 * matrices) no real eigenvectors exist and a status note explains.
 */
export function EigenvectorFinder() {
  const [iHat, setIHat] = useState<Vec>({ x: 1.6, y: 0.4 })
  const [jHat, setJHat] = useState<Vec>({ x: 0.6, y: 1.4 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const M = { a: iHat.x, b: jHat.x, c: iHat.y, d: jHat.y }
  const result = eigen(M)

  const apply = (p: Vec): Vec => ({
    x: p.x * iHat.x + p.y * jHat.x,
    y: p.x * iHat.y + p.y * jHat.y,
  })

  const lines = useMemo(() => {
    const lines: Array<{
      id: string
      x1: number
      y1: number
      x2: number
      y2: number
    }> = []
    for (let i = -GRID; i <= GRID; i++) {
      const start = apply({ x: i, y: -GRID })
      const end = apply({ x: i, y: GRID })
      lines.push({
        id: `vx-${i}`,
        x1: xScale(start.x),
        y1: yScale(start.y),
        x2: xScale(end.x),
        y2: yScale(end.y),
      })
    }
    for (let j = -GRID; j <= GRID; j++) {
      const start = apply({ x: -GRID, y: j })
      const end = apply({ x: GRID, y: j })
      lines.push({
        id: `hy-${j}`,
        x1: xScale(start.x),
        y1: yScale(start.y),
        x2: xScale(end.x),
        y2: yScale(end.y),
      })
    }
    return lines
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iHat.x, iHat.y, jHat.x, jHat.y])

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
    if (active === 'i') setIHat(p)
    else setJHat(p)
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
            <Arrowhead id="ef-i" color={I_COLOR} />
            <Arrowhead id="ef-j" color={J_COLOR} />
            <clipPath id="ef-clip">
              <rect
                x={PAD}
                y={PAD}
                width={SIZE - 2 * PAD}
                height={SIZE - 2 * PAD}
              />
            </clipPath>
          </defs>

          {/* faint standard grid */}
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

          {/* deformed grid in light teal — context for what the matrix does */}
          <g clipPath="url(#ef-clip)">
            {lines.map((l) => (
              <line
                key={l.id}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="rgba(29, 158, 117, 0.18)"
                strokeWidth={1}
              />
            ))}
          </g>

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

          {/* eigenvector lines */}
          <g clipPath="url(#ef-clip)">
            {result.kind === 'real-pair' && (
              <>
                <EigenLine v={result.v1} color={EIGEN_COLOR_1} />
                <EigenLine v={result.v2} color={EIGEN_COLOR_2} />
              </>
            )}
            {result.kind === 'real-double' && (
              <EigenLine v={result.v} color={EIGEN_COLOR_1} />
            )}
          </g>

          {/* basis vectors */}
          <Arrow
            head={iHat}
            color={I_COLOR}
            markerId="ef-i"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="ef-j"
            xs={xScale}
            ys={yScale}
          />

          <Handle
            x={xScale(iHat.x)}
            y={yScale(iHat.y)}
            color={I_COLOR}
            label="î"
            active={active === 'i'}
            onPointerDown={(e) => startDrag('i', e)}
          />
          <Handle
            x={xScale(jHat.x)}
            y={yScale(jHat.y)}
            color={J_COLOR}
            label="ĵ"
            active={active === 'j'}
            onPointerDown={(e) => startDrag('j', e)}
          />
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] space-y-2 font-mono text-[12px]">
        {result.kind === 'real-pair' && (
          <>
            <EigenRow
              color={EIGEN_COLOR_1}
              lambda={result.lambda1}
              v={result.v1}
            />
            <EigenRow
              color={EIGEN_COLOR_2}
              lambda={result.lambda2}
              v={result.v2}
            />
          </>
        )}
        {result.kind === 'real-double' && (
          <>
            <EigenRow
              color={EIGEN_COLOR_1}
              lambda={result.lambda}
              v={result.v}
            />
            <p className="text-mute">
              Repeated eigenvalue — the matrix is on the boundary between
              two real eigenvectors collapsing to one.
            </p>
          </>
        )}
        {result.kind === 'complex' && (
          <p className="text-mute">
            Eigenvalues are complex: λ ={' '}
            <span className="text-ink">
              {result.real.toFixed(2)} ± {result.imag.toFixed(2)} i
            </span>
            . The transformation has rotation in it; no real direction
            stays on its line.
          </p>
        )}
      </div>
    </figure>
  )
}

function EigenLine({ v, color }: { v: Vec2; color: string }) {
  // Line through origin in direction v, extended to ±100·v then clipped.
  return (
    <line
      x1={xScale(-100 * v.x)}
      y1={yScale(-100 * v.y)}
      x2={xScale(100 * v.x)}
      y2={yScale(100 * v.y)}
      stroke={color}
      strokeWidth={3}
      strokeOpacity={0.85}
    />
  )
}

function EigenRow({
  color,
  lambda,
  v,
}: {
  color: string
  lambda: number
  v: Vec2
}) {
  return (
    <p className="leading-snug">
      <span style={{ color }}>λ = {lambda.toFixed(3)}</span>
      <span className="text-mute">
        {'   '}direction ({v.x.toFixed(2)}, {v.y.toFixed(2)})
      </span>
    </p>
  )
}
