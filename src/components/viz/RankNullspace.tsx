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
const DOMAIN: [number, number] = [-3.5, 3.5]
const TICKS = [-3, -2, -1, 1, 2, 3]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral
const NULL_COLOR = VIZ.amber

const SINGULAR_THRESHOLD = 0.06
const ZERO_THRESHOLD = 0.06

type Which = 'i' | 'j'

type Nullspace = { kind: 'trivial' } | { kind: 'line'; dir: Vec } | { kind: 'all' }

function nullspaceFor(iHat: Vec, jHat: Vec): Nullspace {
  const det = iHat.x * jHat.y - iHat.y * jHat.x
  if (Math.abs(det) > SINGULAR_THRESHOLD) return { kind: 'trivial' }

  const iNorm = Math.hypot(iHat.x, iHat.y)
  const jNorm = Math.hypot(jHat.x, jHat.y)
  if (iNorm < ZERO_THRESHOLD && jNorm < ZERO_THRESHOLD) return { kind: 'all' }

  // Solve x·iHat + y·jHat = 0 for non-trivial (x, y).
  if (iNorm >= ZERO_THRESHOLD) {
    let dir = { x: -jHat.x, y: iHat.x }
    if (Math.hypot(dir.x, dir.y) < ZERO_THRESHOLD) {
      dir = { x: -jHat.y, y: iHat.y }
    }
    return { kind: 'line', dir }
  }
  // iHat is zero, jHat non-zero. Any (x, 0) works.
  return { kind: 'line', dir: { x: 1, y: 0 } }
}

function rankOf(iHat: Vec, jHat: Vec): 0 | 1 | 2 {
  const det = iHat.x * jHat.y - iHat.y * jHat.x
  if (Math.abs(det) > SINGULAR_THRESHOLD) return 2
  const iNorm = Math.hypot(iHat.x, iHat.y)
  const jNorm = Math.hypot(jHat.x, jHat.y)
  if (iNorm < ZERO_THRESHOLD && jNorm < ZERO_THRESHOLD) return 0
  return 1
}

/**
 * Drag î and ĵ. When the matrix is invertible (det ≠ 0) the null space is
 * trivial. Otherwise an amber line through the origin highlights the
 * direction whose vectors all map to zero — the null space.
 */
export function RankNullspace() {
  const [iHat, setIHat] = useState<Vec>({ x: 1.5, y: 0.5 })
  const [jHat, setJHat] = useState<Vec>({ x: -0.5, y: 1.4 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const ns = nullspaceFor(iHat, jHat)
  const rank = rankOf(iHat, jHat)
  const det = iHat.x * jHat.y - iHat.y * jHat.x

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
            <Arrowhead id="rn-i" color={I_COLOR} />
            <Arrowhead id="rn-j" color={J_COLOR} />
            <clipPath id="rn-clip">
              <rect
                x={PAD}
                y={PAD}
                width={SIZE - 2 * PAD}
                height={SIZE - 2 * PAD}
              />
            </clipPath>
          </defs>

          {/* null-space shading */}
          {ns.kind === 'all' && (
            <rect
              x={PAD}
              y={PAD}
              width={SIZE - 2 * PAD}
              height={SIZE - 2 * PAD}
              fill={NULL_COLOR}
              fillOpacity={0.15}
            />
          )}
          {ns.kind === 'line' && (
            <g clipPath="url(#rn-clip)">
              <line
                x1={xScale(-100 * ns.dir.x)}
                y1={yScale(-100 * ns.dir.y)}
                x2={xScale(100 * ns.dir.x)}
                y2={yScale(100 * ns.dir.y)}
                stroke={NULL_COLOR}
                strokeWidth={3}
                strokeOpacity={0.8}
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

          {/* basis vectors */}
          <Arrow
            head={iHat}
            color={I_COLOR}
            markerId="rn-i"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="rn-j"
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

      <div className="mx-auto mt-4 max-w-[480px] space-y-2">
        <div className="grid grid-cols-3 gap-3 border-b border-line pb-3 font-mono text-[12px]">
          <div>
            <span className="text-mute">det</span>
            <p
              className="font-serif text-2xl tabular-nums"
              style={{
                color:
                  Math.abs(det) < 0.02
                    ? VIZ.mute
                    : det < 0
                      ? VIZ.coral
                      : VIZ.ink,
              }}
            >
              {det.toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-mute">rank</span>
            <p
              className="font-serif text-2xl tabular-nums"
              style={{ color: rank < 2 ? NULL_COLOR : VIZ.ink }}
            >
              {rank}
            </p>
          </div>
          <div>
            <span className="text-mute">invertible?</span>
            <p
              className="font-serif text-2xl"
              style={{ color: rank === 2 ? VIZ.teal : NULL_COLOR }}
            >
              {rank === 2 ? 'yes' : 'no'}
            </p>
          </div>
        </div>

        <p className="text-[12px] leading-snug text-mute">
          {ns.kind === 'trivial' &&
            'null space = {0}: only the zero vector maps to zero. M is invertible; M⁻¹ exists.'}
          {ns.kind === 'line' && (
            <>
              null space = the amber line: every vector along it maps to
              zero. M cannot be inverted — different inputs share the same
              output.
            </>
          )}
          {ns.kind === 'all' &&
            'null space = ℝ²: every vector maps to zero. The transformation has annihilated everything.'}
        </p>
      </div>
    </figure>
  )
}
