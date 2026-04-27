import { useState } from 'react'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'

type Vec3 = [number, number, number]

const SIZE = 480
const ORIGIN_X = SIZE / 2
const ORIGIN_Y = SIZE / 2 + 50
const SCALE = 60

// Oblique projection: x stays, y stays, z shifts both. Cabinet projection
// with a 30° depth angle.
function project(p: Vec3): { x: number; y: number } {
  const [x, y, z] = p
  const skewX = -0.55 * z
  const skewY = -0.4 * z
  return {
    x: ORIGIN_X + (x + skewX) * SCALE,
    y: ORIGIN_Y - (y + skewY) * SCALE,
  }
}

function rotY(theta: number, p: Vec3): Vec3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]]
}
function rotX(theta: number, p: Vec3): Vec3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]
}

// 12 edges of a unit cube in [0, 1]^3.
const CUBE_VERTICES: Vec3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
]
const CUBE_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0], // bottom
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4], // top
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7], // verticals
]

// Long axis lines for orientation context.
const AXIS_LEN = 2.6

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral
const K_COLOR = VIZ.teal

export function ThreeDPreview() {
  const [yaw, setYaw] = useState(0.55)
  const [pitch, setPitch] = useState(0.32)

  const xform = (p: Vec3): Vec3 => rotX(pitch, rotY(yaw, p))

  // Project transformed cube
  const projectedCube = CUBE_VERTICES.map((v) => project(xform(v)))
  const iEnd = project(xform([1, 0, 0]))
  const jEnd = project(xform([0, 1, 0]))
  const kEnd = project(xform([0, 0, 1]))
  const origin = project(xform([0, 0, 0]))
  const xAxisEnd = project(xform([AXIS_LEN, 0, 0]))
  const xAxisStart = project(xform([-AXIS_LEN * 0.4, 0, 0]))
  const yAxisEnd = project(xform([0, AXIS_LEN, 0]))
  const yAxisStart = project(xform([0, -AXIS_LEN * 0.4, 0]))
  const zAxisEnd = project(xform([0, 0, AXIS_LEN]))
  const zAxisStart = project(xform([0, 0, -AXIS_LEN * 0.4]))

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto aspect-square w-full max-w-[480px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-full w-full"
        >
          <defs>
            <marker
              id="td-i"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={I_COLOR} />
            </marker>
            <marker
              id="td-j"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={J_COLOR} />
            </marker>
            <marker
              id="td-k"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={K_COLOR} />
            </marker>
          </defs>

          {/* faint axis lines */}
          <line
            x1={xAxisStart.x}
            y1={xAxisStart.y}
            x2={xAxisEnd.x}
            y2={xAxisEnd.y}
            stroke={VIZ.line}
            strokeWidth={1}
          />
          <line
            x1={yAxisStart.x}
            y1={yAxisStart.y}
            x2={yAxisEnd.x}
            y2={yAxisEnd.y}
            stroke={VIZ.line}
            strokeWidth={1}
          />
          <line
            x1={zAxisStart.x}
            y1={zAxisStart.y}
            x2={zAxisEnd.x}
            y2={zAxisEnd.y}
            stroke={VIZ.line}
            strokeWidth={1}
          />

          {/* cube edges */}
          {CUBE_EDGES.map(([a, b], idx) => {
            const pa = projectedCube[a]
            const pb = projectedCube[b]
            return (
              <line
                key={idx}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={VIZ.lineStrong}
                strokeOpacity={0.55}
                strokeWidth={1.5}
              />
            )
          })}

          {/* basis arrows from origin */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={iEnd.x}
            y2={iEnd.y}
            stroke={I_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd="url(#td-i)"
          />
          <line
            x1={origin.x}
            y1={origin.y}
            x2={jEnd.x}
            y2={jEnd.y}
            stroke={J_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd="url(#td-j)"
          />
          <line
            x1={origin.x}
            y1={origin.y}
            x2={kEnd.x}
            y2={kEnd.y}
            stroke={K_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd="url(#td-k)"
          />

          <text
            x={iEnd.x + 8}
            y={iEnd.y + 4}
            fill={I_COLOR}
            fontSize={14}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            î
          </text>
          <text
            x={jEnd.x + 4}
            y={jEnd.y - 8}
            fill={J_COLOR}
            fontSize={14}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            ĵ
          </text>
          <text
            x={kEnd.x + 8}
            y={kEnd.y - 4}
            fill={K_COLOR}
            fontSize={14}
            fontStyle="italic"
            fontFamily="var(--font-serif), serif"
          >
            k̂
          </text>
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] grid grid-cols-2 gap-x-4 gap-y-3">
        <Slider
          label="yaw"
          min={-Math.PI}
          max={Math.PI}
          step={0.01}
          value={yaw}
          onChange={setYaw}
          display={`${((yaw * 180) / Math.PI).toFixed(0)}°`}
        />
        <Slider
          label="pitch"
          min={-Math.PI / 2}
          max={Math.PI / 2}
          step={0.01}
          value={pitch}
          onChange={setPitch}
          display={`${((pitch * 180) / Math.PI).toFixed(0)}°`}
        />
      </div>
    </figure>
  )
}
