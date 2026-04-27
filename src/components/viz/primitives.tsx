import type { PointerEvent } from 'react'
import type { ScaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'

export type Vec = { x: number; y: number }

export function clampToDomain(p: Vec, domain: [number, number]): Vec {
  const c = (n: number) => Math.max(domain[0], Math.min(domain[1], n))
  return { x: c(p.x), y: c(p.y) }
}

export function fmt(n: number) {
  return (n >= 0 ? ' ' : '') + n.toFixed(2)
}

export function Arrowhead({ id, color }: { id: string; color: string }) {
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

/**
 * Arrow from origin (or `tail`) to `head` in data coordinates, drawn through
 * the supplied scales. The line is shortened slightly so the arrowhead doesn't
 * overshoot the data point.
 */
export function Arrow({
  tail,
  head,
  color,
  markerId,
  xs,
  ys,
  width = 2.5,
  opacity = 1,
  dashed = false,
}: {
  tail?: Vec
  head: Vec
  color: string
  markerId: string
  xs: ScaleLinear<number, number>
  ys: ScaleLinear<number, number>
  width?: number
  opacity?: number
  dashed?: boolean
}) {
  const t = tail ?? { x: 0, y: 0 }
  const px0 = xs(t.x)
  const py0 = ys(t.y)
  const px1 = xs(head.x)
  const py1 = ys(head.y)
  const dx = px1 - px0
  const dy = py1 - py0
  const len = Math.hypot(dx, dy)
  if (len < 1) return null
  const shorten = Math.min(8, len * 0.08)
  const r = (len - shorten) / len
  return (
    <line
      x1={px0}
      y1={py0}
      x2={px0 + dx * r}
      y2={py0 + dy * r}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={`url(#${markerId})`}
      opacity={opacity}
    />
  )
}

/**
 * Drag handle: invisible 20px touch target plus a small visible disc with a
 * label. The disc grows when `active` to give a press affordance.
 */
export function Handle({
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

export function pointerToData(
  svg: SVGSVGElement | null,
  e: PointerEvent,
  size: number,
  xs: ScaleLinear<number, number>,
  ys: ScaleLinear<number, number>,
): Vec {
  if (!svg) return { x: 0, y: 0 }
  const rect = svg.getBoundingClientRect()
  const sx = ((e.clientX - rect.left) / rect.width) * size
  const sy = ((e.clientY - rect.top) / rect.height) * size
  return { x: xs.invert(sx), y: ys.invert(sy) }
}
