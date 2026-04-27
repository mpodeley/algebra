import { useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-5.2, 5.2]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const GRID = 5

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral

type Vec = { x: number; y: number }
type Which = 'i' | 'j'

interface Props {
  /** Initial position of î (default standard basis (1,0)). */
  initialIHat?: Vec
  /** Initial position of ĵ (default standard basis (0,1)). */
  initialJHat?: Vec
  /** Whether the unit square at the origin is highlighted. */
  showUnitSquare?: boolean
}

const fmt = (n: number) => (n >= 0 ? ' ' : '') + n.toFixed(2)

function clamp(p: Vec): Vec {
  const c = (n: number) => Math.max(DOMAIN[0], Math.min(DOMAIN[1], n))
  return { x: c(p.x), y: c(p.y) }
}

/**
 * The colored grid. Drag î / ĵ; every cell of the original integer grid is
 * mapped by (a, b) ↦ a·î + b·ĵ. The hue stays attached to the original
 * coordinates so deformations are legible at a glance.
 *
 * Used as the recurring linear-transformation visualization across the
 * essence chapters and the random-matrix application chapters.
 */
export function GridTransform({
  initialIHat = { x: 1, y: 0 },
  initialJHat = { x: 0, y: 1 },
  showUnitSquare = false,
}: Props) {
  const [iHat, setIHat] = useState<Vec>(initialIHat)
  const [jHat, setJHat] = useState<Vec>(initialJHat)
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const clipId = useId()

  // Linear map: (a, b) ↦ a·î + b·ĵ.
  const apply = (p: Vec): Vec => ({
    x: p.x * iHat.x + p.y * jHat.x,
    y: p.x * iHat.y + p.y * jHat.y,
  })

  // Cells + warped grid lines depend on iHat/jHat. Recompute on every change.
  const { cells, lines, unitSquarePts } = useMemo(() => {
    const cells: Array<{ id: string; pts: string; fill: string }> = []
    for (let i = -GRID; i < GRID; i++) {
      for (let j = -GRID; j < GRID; j++) {
        const corners = [
          { x: i, y: j },
          { x: i + 1, y: j },
          { x: i + 1, y: j + 1 },
          { x: i, y: j + 1 },
        ]
        const pts = corners
          .map((p) => apply(p))
          .map((p) => `${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
          .join(' ')
        const hue = (((i + GRID) * 17 + (j + GRID) * 23) % 360 + 360) % 360
        cells.push({
          id: `c-${i}-${j}`,
          pts,
          fill: `hsla(${hue}, 35%, 86%, 0.55)`,
        })
      }
    }

    const lines: Array<{
      id: string
      x1: number
      y1: number
      x2: number
      y2: number
    }> = []
    for (let i = -GRID; i <= GRID; i++) {
      const a = apply({ x: i, y: -GRID })
      const b = apply({ x: i, y: GRID })
      lines.push({
        id: `vx-${i}`,
        x1: xScale(a.x),
        y1: yScale(a.y),
        x2: xScale(b.x),
        y2: yScale(b.y),
      })
    }
    for (let j = -GRID; j <= GRID; j++) {
      const a = apply({ x: -GRID, y: j })
      const b = apply({ x: GRID, y: j })
      lines.push({
        id: `hy-${j}`,
        x1: xScale(a.x),
        y1: yScale(a.y),
        x2: xScale(b.x),
        y2: yScale(b.y),
      })
    }

    const unitCorners = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    const unitSquarePts = unitCorners
      .map((p) => apply(p))
      .map((p) => `${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
      .join(' ')

    return { cells, lines, unitSquarePts }
    // apply depends on iHat/jHat, so we depend on those primitives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iHat.x, iHat.y, jHat.x, jHat.y])

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
    if (active === 'i') setIHat(p)
    else setJHat(p)
  }
  function endDrag() {
    setActive(null)
  }
  function reset() {
    setIHat(initialIHat)
    setJHat(initialJHat)
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
            <Arrowhead id="gt-arrow-i" color={I_COLOR} />
            <Arrowhead id="gt-arrow-j" color={J_COLOR} />
            <clipPath id={clipId}>
              <rect
                x={PAD}
                y={PAD}
                width={SIZE - 2 * PAD}
                height={SIZE - 2 * PAD}
              />
            </clipPath>
          </defs>

          {/* white plate so the colored cells don't bleed into edges */}
          <rect
            x={PAD}
            y={PAD}
            width={SIZE - 2 * PAD}
            height={SIZE - 2 * PAD}
            fill={VIZ.surface}
          />

          <g clipPath={`url(#${clipId})`}>
            {cells.map((c) => (
              <polygon key={c.id} points={c.pts} fill={c.fill} stroke="none" />
            ))}
            {lines.map((l) => (
              <line
                key={l.id}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={VIZ.line}
                strokeWidth={1}
              />
            ))}
            {showUnitSquare && (
              <polygon
                points={unitSquarePts}
                fill="none"
                stroke={VIZ.ink}
                strokeOpacity={0.55}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}
          </g>

          {/* screen-aligned axes — drawn over the warped grid */}
          <line
            x1={xScale(DOMAIN[0])}
            x2={xScale(DOMAIN[1])}
            y1={yScale(0)}
            y2={yScale(0)}
            stroke={VIZ.lineStrong}
            strokeWidth={1}
          />
          <line
            y1={yScale(DOMAIN[0])}
            y2={yScale(DOMAIN[1])}
            x1={xScale(0)}
            x2={xScale(0)}
            stroke={VIZ.lineStrong}
            strokeWidth={1}
          />

          {/* basis vectors */}
          <Arrow
            head={iHat}
            color={I_COLOR}
            markerId="gt-arrow-i"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="gt-arrow-j"
            xs={xScale}
            ys={yScale}
          />

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

      <div className="mx-auto mt-4 flex max-w-[480px] items-center justify-between gap-3">
        <div className="grid flex-1 grid-cols-2 gap-2 font-mono text-[12px]">
          <div className="flex items-baseline gap-2 border-l-2 border-line pl-2.5">
            <span style={{ color: I_COLOR }} className="font-serif italic">
              î
            </span>
            <span className="text-mute">
              ({fmt(iHat.x)}, {fmt(iHat.y)})
            </span>
          </div>
          <div className="flex items-baseline gap-2 border-l-2 border-line pl-2.5">
            <span style={{ color: J_COLOR }} className="font-serif italic">
              ĵ
            </span>
            <span className="text-mute">
              ({fmt(jHat.x)}, {fmt(jHat.y)})
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-(--radius-button) border border-line px-2.5 py-1 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent"
        >
          reset
        </button>
      </div>
    </figure>
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
  xs,
  ys,
}: {
  head: Vec
  color: string
  markerId: string
  xs: ScaleLinear<number, number>
  ys: ScaleLinear<number, number>
}) {
  const px0 = xs(0)
  const py0 = ys(0)
  const px1 = xs(head.x)
  const py1 = ys(head.y)
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
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      markerEnd={`url(#${markerId})`}
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
