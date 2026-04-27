import { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'
import { Arrow, Arrowhead, fmt } from './primitives'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-4.5, 4.5]
const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral
const P_COLOR = VIZ.teal

const I_HAT = { x: 1, y: 0 }
const J_HAT = { x: 0, y: 1 }

/**
 * Two sliders, a and b, control the linear combination a·î + b·ĵ for the
 * standard basis. The visual decomposes into two stacked scaled basis arrows
 * to make the construction tangible.
 */
export function LinearCombo() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(1.5)

  // a·î = (a, 0); b·ĵ tail starts there and ends at (a, b).
  const aIHat = { x: a * I_HAT.x, y: a * I_HAT.y }
  const target = { x: a * I_HAT.x + b * J_HAT.x, y: a * I_HAT.y + b * J_HAT.y }

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto aspect-square w-full max-w-[480px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-full w-full"
        >
          <defs>
            <Arrowhead id="lc-i" color={I_COLOR} />
            <Arrowhead id="lc-j" color={J_COLOR} />
            <Arrowhead id="lc-ai" color={I_COLOR} />
            <Arrowhead id="lc-bj" color={J_COLOR} />
          </defs>

          {/* grid */}
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

          {/* basis vectors î, ĵ — small, faint, to anchor the construction */}
          <Arrow
            head={I_HAT}
            color={I_COLOR}
            markerId="lc-i"
            xs={xScale}
            ys={yScale}
            width={1.75}
            opacity={0.5}
          />
          <Arrow
            head={J_HAT}
            color={J_COLOR}
            markerId="lc-j"
            xs={xScale}
            ys={yScale}
            width={1.75}
            opacity={0.5}
          />
          <text
            x={xScale(I_HAT.x) + 8}
            y={yScale(I_HAT.y) + 16}
            fill={I_COLOR}
            fontSize={13}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
            opacity={0.7}
          >
            î
          </text>
          <text
            x={xScale(J_HAT.x) + 6}
            y={yScale(J_HAT.y) + 4}
            fill={J_COLOR}
            fontSize={13}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
            opacity={0.7}
          >
            ĵ
          </text>

          {/* a·î — bold, scaled basis arrow */}
          <Arrow
            head={aIHat}
            color={I_COLOR}
            markerId="lc-ai"
            xs={xScale}
            ys={yScale}
          />
          {/* b·ĵ — starts where a·î ended */}
          <Arrow
            tail={aIHat}
            head={target}
            color={J_COLOR}
            markerId="lc-bj"
            xs={xScale}
            ys={yScale}
          />

          {/* destination point */}
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
            fontWeight={500}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            P
          </text>
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] space-y-3">
        <Slider
          label="a · î"
          min={-3}
          max={3}
          step={0.05}
          value={a}
          onChange={setA}
          display={`a = ${a.toFixed(2)}`}
        />
        <Slider
          label="b · ĵ"
          min={-3}
          max={3}
          step={0.05}
          value={b}
          onChange={setB}
          display={`b = ${b.toFixed(2)}`}
        />

        <div className="font-mono text-[12px]">
          <span className="text-mute">P = a · î + b · ĵ = </span>
          <span style={{ color: P_COLOR }}>
            ({fmt(target.x)}, {fmt(target.y)})
          </span>
        </div>
      </div>
    </figure>
  )
}
