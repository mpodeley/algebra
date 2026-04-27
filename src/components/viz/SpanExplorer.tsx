import { useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
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
const DOMAIN: [number, number] = [-5, 5]
const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const V_COLOR = VIZ.blue
const W_COLOR = VIZ.coral

const INDEPENDENCE_THRESHOLD = 0.06 // |v×w| above this counts as independent
const ZERO_THRESHOLD = 0.06

type Which = 'v' | 'w'

/**
 * Drag two vectors v and w, watch their span. When v and w are linearly
 * independent the span is the entire plane (shaded teal). When they are
 * parallel (cross product near zero) the span collapses to a line through
 * the origin.
 */
export function SpanExplorer() {
  const [v, setV] = useState<Vec>({ x: 2, y: 1 })
  const [w, setW] = useState<Vec>({ x: -1, y: 2 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const cross = v.x * w.y - v.y * w.x
  const vNorm = Math.hypot(v.x, v.y)
  const wNorm = Math.hypot(w.x, w.y)
  const bothZero = vNorm < ZERO_THRESHOLD && wNorm < ZERO_THRESHOLD
  const independent = !bothZero && Math.abs(cross) > INDEPENDENCE_THRESHOLD

  // Direction vector of the span line (when not independent).
  const dir = vNorm >= wNorm ? v : w
  const dirNorm = Math.hypot(dir.x, dir.y)

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
            <Arrowhead id="se-v" color={V_COLOR} />
            <Arrowhead id="se-w" color={W_COLOR} />
            <clipPath id="se-clip">
              <rect
                x={PAD}
                y={PAD}
                width={SIZE - 2 * PAD}
                height={SIZE - 2 * PAD}
              />
            </clipPath>
          </defs>

          {/* span shading — drawn first so everything sits on top */}
          {!bothZero && independent && (
            <rect
              x={PAD}
              y={PAD}
              width={SIZE - 2 * PAD}
              height={SIZE - 2 * PAD}
              fill={VIZ.teal}
              fillOpacity={0.13}
            />
          )}
          {!bothZero && !independent && dirNorm > ZERO_THRESHOLD && (
            <g clipPath="url(#se-clip)">
              {/* extend far beyond the viewBox; the clipPath crops it */}
              <line
                x1={xScale(-100 * dir.x)}
                y1={yScale(-100 * dir.y)}
                x2={xScale(100 * dir.x)}
                y2={yScale(100 * dir.y)}
                stroke={VIZ.teal}
                strokeWidth={3}
                strokeOpacity={0.7}
              />
            </g>
          )}

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

          {/* vectors */}
          <Arrow
            head={v}
            color={V_COLOR}
            markerId="se-v"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={w}
            color={W_COLOR}
            markerId="se-w"
            xs={xScale}
            ys={yScale}
          />

          {/* drag handles */}
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
        <p
          className="font-mono text-[12px] leading-snug"
          style={{ color: bothZero ? VIZ.mute : VIZ.ink }}
        >
          <span className="text-mute">span(v, w) = </span>
          <span style={{ color: VIZ.teal }}>
            {bothZero
              ? '{0} — both vectors are zero'
              : independent
                ? 'ℝ² — every point in the plane is reachable'
                : 'a line through the origin — only one direction is reachable'}
          </span>
        </p>
        <p className="font-mono text-[11px] text-mute">
          v × w = {cross.toFixed(3)} (zero ⇔ parallel ⇔ span collapses)
        </p>
      </div>
    </figure>
  )
}
