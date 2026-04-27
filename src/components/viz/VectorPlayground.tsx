import { useRef, useState, type PointerEvent } from 'react'
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { VECTOR_COLORS, VIZ } from '../../lib/viz/colors'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-5, 5]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

type Vec = { x: number; y: number }
type Which = 'v' | 'w'

const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4]

const fmt = (n: number) =>
  (n >= 0 ? ' ' : '') + n.toFixed(1).replace(/\.0$/, '.0')

export function VectorPlayground() {
  const [v, setV] = useState<Vec>({ x: 2.5, y: 1 })
  const [w, setW] = useState<Vec>({ x: 1, y: 2.5 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const sum: Vec = { x: v.x + w.x, y: v.y + w.y }

  function clientToData(e: PointerEvent): Vec {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const sx = ((e.clientX - rect.left) / rect.width) * SIZE
    const sy = ((e.clientY - rect.top) / rect.height) * SIZE
    return clamp({ x: xScale.invert(sx), y: yScale.invert(sy) })
  }

  function startDrag(which: Which, e: PointerEvent<SVGCircleElement>) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setActive(which)
  }
  function moveDrag(e: PointerEvent<SVGSVGElement>) {
    if (!active) return
    const p = clientToData(e)
    if (active === 'v') setV(p)
    else setW(p)
  }
  function endDrag(e: PointerEvent<SVGSVGElement>) {
    if (!active) return
    setActive(null)
    const target = e.target as Element
    if (
      target instanceof Element &&
      'releasePointerCapture' in target &&
      typeof target.releasePointerCapture === 'function'
    ) {
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {
        /* element may have lost capture already */
      }
    }
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
            <Arrowhead id="vp-arrow-v" color={VECTOR_COLORS.v} />
            <Arrowhead id="vp-arrow-w" color={VECTOR_COLORS.w} />
            <Arrowhead id="vp-arrow-sum" color={VECTOR_COLORS.sum} />
          </defs>

          <Grid />

          {/* parallelogram dashed guides */}
          <line
            x1={xScale(v.x)}
            y1={yScale(v.y)}
            x2={xScale(sum.x)}
            y2={yScale(sum.y)}
            stroke={VECTOR_COLORS.w}
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <line
            x1={xScale(w.x)}
            y1={yScale(w.y)}
            x2={xScale(sum.x)}
            y2={yScale(sum.y)}
            stroke={VECTOR_COLORS.v}
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />

          {/* sum first (drawn underneath drag handles) */}
          <Arrow
            head={sum}
            color={VECTOR_COLORS.sum}
            markerId="vp-arrow-sum"
            xScale={xScale}
            yScale={yScale}
            opacity={0.85}
          />
          <Arrow
            head={v}
            color={VECTOR_COLORS.v}
            markerId="vp-arrow-v"
            xScale={xScale}
            yScale={yScale}
          />
          <Arrow
            head={w}
            color={VECTOR_COLORS.w}
            markerId="vp-arrow-w"
            xScale={xScale}
            yScale={yScale}
          />

          {/* drag handles last so they're on top */}
          <Handle
            x={xScale(v.x)}
            y={yScale(v.y)}
            color={VECTOR_COLORS.v}
            label="v"
            active={active === 'v'}
            onPointerDown={(e) => startDrag('v', e)}
          />
          <Handle
            x={xScale(w.x)}
            y={yScale(w.y)}
            color={VECTOR_COLORS.w}
            label="w"
            active={active === 'w'}
            onPointerDown={(e) => startDrag('w', e)}
          />
        </svg>
      </div>

      <div className="mx-auto mt-4 grid max-w-[480px] grid-cols-3 gap-2 font-mono text-[12px]">
        <Readout label="v" color={VECTOR_COLORS.v} vec={v} />
        <Readout label="w" color={VECTOR_COLORS.w} vec={w} />
        <Readout label="v + w" color={VECTOR_COLORS.sum} vec={sum} />
      </div>
    </figure>
  )
}

function clamp(p: Vec): Vec {
  const c = (n: number) => Math.max(DOMAIN[0], Math.min(DOMAIN[1], n))
  return { x: c(p.x), y: c(p.y) }
}

function Grid() {
  return (
    <g>
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
    </g>
  )
}

function Arrowhead({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  )
}

function Arrow({
  head,
  color,
  markerId,
  xScale: xs,
  yScale: ys,
  opacity = 1,
}: {
  head: Vec
  color: string
  markerId: string
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  opacity?: number
}) {
  // Shorten the line so the arrowhead doesn't overshoot the data point.
  const px0 = xs(0)
  const py0 = ys(0)
  const px1 = xs(head.x)
  const py1 = ys(head.y)
  const dx = px1 - px0
  const dy = py1 - py0
  const len = Math.hypot(dx, dy)
  const shorten = Math.min(8, len * 0.08)
  const t = len > 0 ? (len - shorten) / len : 1
  return (
    <line
      x1={px0}
      y1={py0}
      x2={px0 + dx * t}
      y2={py0 + dy * t}
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      markerEnd={`url(#${markerId})`}
      opacity={opacity}
    />
  )
}

function Handle({
  x,
  y,
  color,
  label,
  active,
  onPointerDown,
}: {
  x: number
  y: number
  color: string
  label: string
  active: boolean
  onPointerDown: (e: PointerEvent<SVGCircleElement>) => void
}) {
  return (
    <g>
      {/* large invisible touch target */}
      <circle
        cx={x}
        cy={y}
        r={20}
        fill="transparent"
        onPointerDown={onPointerDown}
        style={{ cursor: 'grab', touchAction: 'none' }}
      />
      <circle
        cx={x}
        cy={y}
        r={active ? 9 : 7}
        fill={VIZ.surface}
        stroke={color}
        strokeWidth={2.5}
        pointerEvents="none"
      />
      <text
        x={x + 12}
        y={y - 10}
        fill={color}
        fontSize={14}
        fontStyle="italic"
        fontFamily="var(--font-serif), serif"
        pointerEvents="none"
      >
        {label}
      </text>
    </g>
  )
}

function Readout({
  label,
  color,
  vec,
}: {
  label: string
  color: string
  vec: Vec
}) {
  return (
    <div className="flex items-baseline gap-2 border-l-2 border-line pl-2.5 leading-tight">
      <span style={{ color }} className="font-serif italic">
        {label}
      </span>
      <span className="text-mute">
        ({fmt(vec.x)}, {fmt(vec.y)})
      </span>
    </div>
  )
}
