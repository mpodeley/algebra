import { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-5, 5]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const TICKS = [-4, -3, -2, -1, 1, 2, 3, 4]

const BASE = { x: 1.5, y: 0.8 }

const fmt = (n: number) => (n >= 0 ? ' ' : '') + n.toFixed(2)

export function ScalarStretch() {
  const [c, setC] = useState(1.5)

  const cv = { x: c * BASE.x, y: c * BASE.y }
  const flipped = c < 0

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto aspect-square w-full max-w-[480px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-full w-full"
        >
          <defs>
            <marker
              id="ss-arrow-cv"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                fill={flipped ? VIZ.coral : VIZ.blue}
              />
            </marker>
            <marker
              id="ss-arrow-base"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={VIZ.mute} />
            </marker>
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

          {/* line through origin in direction of v: shows the span */}
          <SpanLine />

          {/* original v as a thin grey arrow */}
          <line
            x1={xScale(0)}
            y1={yScale(0)}
            x2={xScale(BASE.x * 0.96)}
            y2={yScale(BASE.y * 0.96)}
            stroke={VIZ.mute}
            strokeWidth={1.5}
            strokeOpacity={0.55}
            markerEnd="url(#ss-arrow-base)"
          />
          <text
            x={xScale(BASE.x) + 8}
            y={yScale(BASE.y) - 4}
            fill={VIZ.mute}
            fontSize={13}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            v
          </text>

          {/* scaled c·v */}
          <ScaledArrow c={c} flipped={flipped} />
          <text
            x={xScale(cv.x) + 10}
            y={yScale(cv.y) - 6}
            fill={flipped ? VIZ.coral : VIZ.blue}
            fontSize={14}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            cv
          </text>
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] space-y-3">
        <Slider
          label="scalar c"
          min={-3}
          max={3}
          step={0.05}
          value={c}
          onChange={setC}
          display={`c = ${c.toFixed(2)}`}
        />
        <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
          <div className="flex items-baseline gap-2 border-l-2 border-line pl-2.5">
            <span style={{ color: VIZ.mute }} className="font-serif italic">
              v
            </span>
            <span className="text-mute">
              ({fmt(BASE.x)}, {fmt(BASE.y)})
            </span>
          </div>
          <div className="flex items-baseline gap-2 border-l-2 border-line pl-2.5">
            <span
              style={{ color: flipped ? VIZ.coral : VIZ.blue }}
              className="font-serif italic"
            >
              cv
            </span>
            <span className="text-mute">
              ({fmt(cv.x)}, {fmt(cv.y)})
            </span>
          </div>
        </div>
      </div>
    </figure>
  )
}

function SpanLine() {
  // Extend the line through origin in direction of BASE to the domain edges.
  const slope = BASE.y / BASE.x
  const y1 = slope * DOMAIN[0]
  const y2 = slope * DOMAIN[1]
  return (
    <line
      x1={xScale(DOMAIN[0])}
      y1={yScale(y1)}
      x2={xScale(DOMAIN[1])}
      y2={yScale(y2)}
      stroke={VIZ.lineStrong}
      strokeOpacity={0.5}
      strokeWidth={1}
      strokeDasharray="2 5"
    />
  )
}

function ScaledArrow({ c, flipped }: { c: number; flipped: boolean }) {
  const head = { x: c * BASE.x, y: c * BASE.y }
  const px0 = xScale(0)
  const py0 = yScale(0)
  const px1 = xScale(head.x)
  const py1 = yScale(head.y)
  const dx = px1 - px0
  const dy = py1 - py0
  const len = Math.hypot(dx, dy)
  if (len < 1) return null
  const shorten = Math.min(8, len * 0.08)
  const t = (len - shorten) / len
  return (
    <line
      x1={px0}
      y1={py0}
      x2={px0 + dx * t}
      y2={py0 + dy * t}
      stroke={flipped ? VIZ.coral : VIZ.blue}
      strokeWidth={2.5}
      strokeLinecap="round"
      markerEnd="url(#ss-arrow-cv)"
    />
  )
}
