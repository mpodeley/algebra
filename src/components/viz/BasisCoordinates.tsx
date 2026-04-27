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
const GRID = 4

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const B1_COLOR = VIZ.blue
const B2_COLOR = VIZ.coral
const V_COLOR = VIZ.teal
const BASIS_GRID_COLOR = 'rgba(29, 158, 117, 0.18)' // teal at low alpha

type Which = 'b1' | 'b2' | 'v'

export function BasisCoordinates() {
  const [b1, setB1] = useState<Vec>({ x: 1.6, y: 0.5 })
  const [b2, setB2] = useState<Vec>({ x: -0.4, y: 1.4 })
  const [v, setV] = useState<Vec>({ x: 1.5, y: 2 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const det = b1.x * b2.y - b1.y * b2.x
  const singular = Math.abs(det) < 0.05
  const bA = singular ? NaN : (b2.y * v.x - b2.x * v.y) / det
  const bB = singular ? NaN : (b1.x * v.y - b1.y * v.x) / det

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
    if (active === 'b1') setB1(p)
    else if (active === 'b2') setB2(p)
    else setV(p)
  }
  function endDrag() {
    setActive(null)
  }

  // Lines of the basis-B grid: at each integer multiple of b1, a line in
  // the direction of b2 (and vice versa). Extend to ±GRID copies.
  const basisLines: Array<{
    id: string
    x1: number
    y1: number
    x2: number
    y2: number
  }> = []
  for (let i = -GRID; i <= GRID; i++) {
    const startA = { x: i * b1.x - GRID * b2.x, y: i * b1.y - GRID * b2.y }
    const endA = { x: i * b1.x + GRID * b2.x, y: i * b1.y + GRID * b2.y }
    basisLines.push({
      id: `b2-${i}`,
      x1: xScale(startA.x),
      y1: yScale(startA.y),
      x2: xScale(endA.x),
      y2: yScale(endA.y),
    })
    const startB = { x: i * b2.x - GRID * b1.x, y: i * b2.y - GRID * b1.y }
    const endB = { x: i * b2.x + GRID * b1.x, y: i * b2.y + GRID * b1.y }
    basisLines.push({
      id: `b1-${i}`,
      x1: xScale(startB.x),
      y1: yScale(startB.y),
      x2: xScale(endB.x),
      y2: yScale(endB.y),
    })
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
            <Arrowhead id="bc-b1" color={B1_COLOR} />
            <Arrowhead id="bc-b2" color={B2_COLOR} />
            <Arrowhead id="bc-v" color={V_COLOR} />
            <clipPath id="bc-clip">
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

          {/* B-basis grid (skewed, in teal) */}
          <g clipPath="url(#bc-clip)">
            {basisLines.map((l) => (
              <line
                key={l.id}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={BASIS_GRID_COLOR}
                strokeWidth={1}
              />
            ))}
          </g>

          {/* standard axes — slightly bolder so they remain readable through the B-basis grid */}
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

          {/* basis vectors */}
          <Arrow
            head={b1}
            color={B1_COLOR}
            markerId="bc-b1"
            xs={xScale}
            ys={yScale}
            opacity={0.9}
          />
          <Arrow
            head={b2}
            color={B2_COLOR}
            markerId="bc-b2"
            xs={xScale}
            ys={yScale}
            opacity={0.9}
          />

          {/* v arrow */}
          <Arrow
            head={v}
            color={V_COLOR}
            markerId="bc-v"
            xs={xScale}
            ys={yScale}
            width={3}
          />

          {/* drag handles */}
          <Handle
            x={xScale(b1.x)}
            y={yScale(b1.y)}
            color={B1_COLOR}
            label="b₁"
            active={active === 'b1'}
            onPointerDown={(e) => startDrag('b1', e)}
          />
          <Handle
            x={xScale(b2.x)}
            y={yScale(b2.y)}
            color={B2_COLOR}
            label="b₂"
            active={active === 'b2'}
            onPointerDown={(e) => startDrag('b2', e)}
          />
          <Handle
            x={xScale(v.x)}
            y={yScale(v.y)}
            color={V_COLOR}
            label="v"
            active={active === 'v'}
            onPointerDown={(e) => startDrag('v', e)}
          />
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] grid grid-cols-2 gap-3 font-mono text-[12px]">
        <div className="rounded-(--radius-card) border border-line bg-surface px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-mute">
            standard basis
          </p>
          <p
            className="mt-1 font-serif text-lg tabular-nums"
            style={{ color: V_COLOR }}
          >
            ({fmt(v.x)}, {fmt(v.y)})
          </p>
        </div>
        <div className="rounded-(--radius-card) border border-line bg-surface px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-mute">
            basis (b₁, b₂)
          </p>
          <p
            className="mt-1 font-serif text-lg tabular-nums"
            style={{ color: V_COLOR }}
          >
            {singular ? '— (basis collapsed)' : `(${fmt(bA)}, ${fmt(bB)})`}
          </p>
        </div>
      </div>
    </figure>
  )
}
