import { useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'
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
const DOMAIN: [number, number] = [-5, 5]
const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral
const P_COLOR = VIZ.teal

type Which = 'i' | 'j'

/**
 * Drag î and ĵ. Two sliders set an input vector (x, y). The widget shows the
 * destination — x · î + y · ĵ — built up tip-to-tail so the reader can see
 * that the destination is determined by where î and ĵ went, nothing else.
 */
export function VectorTracker() {
  const [iHat, setIHat] = useState<Vec>({ x: 1.4, y: 0.4 })
  const [jHat, setJHat] = useState<Vec>({ x: -0.5, y: 1.2 })
  const [v, setV] = useState<Vec>({ x: 1.5, y: 1 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const xIHat = { x: v.x * iHat.x, y: v.x * iHat.y }
  const target = {
    x: v.x * iHat.x + v.y * jHat.x,
    y: v.x * iHat.y + v.y * jHat.y,
  }

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
            <Arrowhead id="vt-i" color={I_COLOR} />
            <Arrowhead id="vt-j" color={J_COLOR} />
            <Arrowhead id="vt-xi" color={I_COLOR} />
            <Arrowhead id="vt-yj" color={J_COLOR} />
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

          {/* basis arrows */}
          <Arrow
            head={iHat}
            color={I_COLOR}
            markerId="vt-i"
            xs={xScale}
            ys={yScale}
            opacity={0.5}
            width={1.75}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="vt-j"
            xs={xScale}
            ys={yScale}
            opacity={0.5}
            width={1.75}
          />

          {/* tip-to-tail decomposition */}
          <Arrow
            head={xIHat}
            color={I_COLOR}
            markerId="vt-xi"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            tail={xIHat}
            head={target}
            color={J_COLOR}
            markerId="vt-yj"
            xs={xScale}
            ys={yScale}
          />

          {/* destination */}
          <circle
            cx={xScale(target.x)}
            cy={yScale(target.y)}
            r={5.5}
            fill={P_COLOR}
            stroke={VIZ.surface}
            strokeWidth={2}
          />
          <text
            x={xScale(target.x) + 10}
            y={yScale(target.y) - 10}
            fill={P_COLOR}
            fontSize={14}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            T(v)
          </text>

          {/* drag handles */}
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

      <div className="mx-auto mt-4 max-w-[480px] space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Slider
            label="input x"
            min={-3}
            max={3}
            step={0.05}
            value={v.x}
            onChange={(x) => setV((prev) => ({ ...prev, x }))}
            display={v.x.toFixed(2)}
          />
          <Slider
            label="input y"
            min={-3}
            max={3}
            step={0.05}
            value={v.y}
            onChange={(y) => setV((prev) => ({ ...prev, y }))}
            display={v.y.toFixed(2)}
          />
        </div>

        <div className="space-y-1 border-t border-line pt-3 font-mono text-[12px] leading-snug">
          <div>
            <span className="text-mute">v = </span>
            <span className="text-ink">
              ({fmt(v.x)}, {fmt(v.y)})
            </span>
          </div>
          <div>
            <span className="text-mute">T(v) = x · î + y · ĵ = </span>
            <span style={{ color: P_COLOR }}>
              ({fmt(target.x)}, {fmt(target.y)})
            </span>
          </div>
        </div>
      </div>
    </figure>
  )
}
