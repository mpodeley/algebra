import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import type { Vec } from './primitives'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-3, 3]
const TICKS = [-2, -1, 1, 2]
const GRID = 3
const SUBDIV = 12 // subdivisions per unit cell — finer for non-linear warps

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

type Warp = {
  id: string
  label: string
  fn: (p: Vec) => Vec
  rules: { origin: boolean; parallel: boolean; spacing: boolean }
  note: string
}

const WARPS: Warp[] = [
  {
    id: 'identity',
    label: 'identity (linear)',
    fn: (p) => p,
    rules: { origin: true, parallel: true, spacing: true },
    note: 'The control: nothing moves.',
  },
  {
    id: 'shear',
    label: 'shear (linear)',
    fn: (p) => ({ x: p.x + 0.6 * p.y, y: p.y }),
    rules: { origin: true, parallel: true, spacing: true },
    note: "Linear, so all three rules hold. Look — same warped grid you've been dragging in chapter 01.",
  },
  {
    id: 'translate',
    label: 'translate by (1, 0.5)',
    fn: (p) => ({ x: p.x + 1, y: p.y + 0.5 }),
    rules: { origin: false, parallel: true, spacing: true },
    note: 'Parallel lines stay parallel and grid spacings are preserved — but the origin has wandered. That single failure is enough to disqualify this from being linear.',
  },
  {
    id: 'rotate-off',
    label: 'rotate around (1.5, 1.5)',
    fn: (p) => {
      const cx = 1.5,
        cy = 1.5,
        theta = 0.5
      const dx = p.x - cx,
        dy = p.y - cy
      return {
        x: cx + Math.cos(theta) * dx - Math.sin(theta) * dy,
        y: cy + Math.sin(theta) * dx + Math.cos(theta) * dy,
      }
    },
    rules: { origin: false, parallel: true, spacing: true },
    note: 'A rotation, but around a point that is not the origin. The grid stays rigid but the origin has been swung away — not linear. Rotations are linear only when the rotation center is the origin.',
  },
  {
    id: 'quadratic',
    label: 'quadratic: (x + 0.2y², y + 0.2x²)',
    fn: (p) => ({
      x: p.x + 0.2 * p.y * p.y,
      y: p.y + 0.2 * p.x * p.x,
    }),
    rules: { origin: true, parallel: false, spacing: false },
    note: 'The origin stays put, but lines that started parallel now curve into different parabolas. Linearity also requires equal spacing to be preserved — which fails here too.',
  },
  {
    id: 'polar-twist',
    label: 'twist: rotate by 0.4 · r',
    fn: (p) => {
      const r = Math.hypot(p.x, p.y)
      const theta = Math.atan2(p.y, p.x) + 0.4 * r
      return { x: r * Math.cos(theta), y: r * Math.sin(theta) }
    },
    rules: { origin: true, parallel: false, spacing: true },
    note: 'A polar twist: every point gets rotated by an amount that depends on its distance from the origin. Origin is fixed, but parallel lines bend into spirals.',
  },
]

const ID_COLOR = '#1A1A1C'

function ruleColor(holds: boolean) {
  return holds ? VIZ.teal : VIZ.coral
}

export function NonlinearWarp() {
  const [warpId, setWarpId] = useState<string>('translate')
  const warp = WARPS.find((w) => w.id === warpId) ?? WARPS[0]

  const cells = useMemo(() => {
    const out: Array<{ id: string; pts: string; fill: string }> = []
    const step = 1 / SUBDIV
    for (let i = -GRID * SUBDIV; i < GRID * SUBDIV; i++) {
      for (let j = -GRID * SUBDIV; j < GRID * SUBDIV; j++) {
        const x0 = i * step
        const y0 = j * step
        const corners = [
          { x: x0, y: y0 },
          { x: x0 + step, y: y0 },
          { x: x0 + step, y: y0 + step },
          { x: x0, y: y0 + step },
        ].map((p) => warp.fn(p))
        const pts = corners
          .map(
            (p) =>
              `${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`,
          )
          .join(' ')
        // Hue tied to the ORIGINAL coordinate, so the warp is legible.
        const hue =
          ((Math.floor(x0 + GRID) * 17 + Math.floor(y0 + GRID) * 23) % 360 +
            360) %
          360
        out.push({
          id: `c-${i}-${j}`,
          pts,
          fill: `hsla(${hue}, 35%, 86%, 0.55)`,
        })
      }
    }
    return out
  }, [warp])

  // Two reference lines that started parallel (and horizontal) at y=1 and y=2.
  // After warp, they may curve.
  const referenceLines = useMemo(() => {
    const samples = 80
    const lines: Array<{ id: string; d: string; color: string }> = []
    for (const y0 of [1, 2]) {
      const pts: string[] = []
      for (let s = 0; s <= samples; s++) {
        const x = -GRID + ((2 * GRID) * s) / samples
        const p = warp.fn({ x, y: y0 })
        const px = xScale(p.x).toFixed(1)
        const py = yScale(p.y).toFixed(1)
        pts.push(`${s === 0 ? 'M' : 'L'} ${px},${py}`)
      }
      lines.push({
        id: `ref-${y0}`,
        d: pts.join(' '),
        color: VIZ.amber,
      })
    }
    return lines
  }, [warp])

  // Origin marker
  const origin = warp.fn({ x: 0, y: 0 })

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
        <div>
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-mute">
              transformation
            </span>
            <select
              value={warpId}
              onChange={(e) => setWarpId(e.target.value)}
              className="block w-full rounded-(--radius-button) border border-line bg-surface px-2.5 py-2 text-[13px] text-ink focus:border-accent focus:outline-none"
            >
              {WARPS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="aspect-square w-full">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block h-full w-full"
          >
            <defs>
              <clipPath id="nlw-clip">
                <rect
                  x={PAD}
                  y={PAD}
                  width={SIZE - 2 * PAD}
                  height={SIZE - 2 * PAD}
                />
              </clipPath>
            </defs>

            <rect
              x={PAD}
              y={PAD}
              width={SIZE - 2 * PAD}
              height={SIZE - 2 * PAD}
              fill={VIZ.surface}
            />

            <g clipPath="url(#nlw-clip)">
              {cells.map((c) => (
                <polygon
                  key={c.id}
                  points={c.pts}
                  fill={c.fill}
                  stroke="none"
                />
              ))}
              {/* reference lines (originally horizontal, originally parallel) */}
              {referenceLines.map((l) => (
                <path
                  key={l.id}
                  d={l.d}
                  fill="none"
                  stroke={l.color}
                  strokeWidth={2}
                  strokeOpacity={0.85}
                />
              ))}
            </g>

            {/* faint reference grid lines for orientation */}
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

            {/* origin: where (0,0) ended up */}
            <circle
              cx={xScale(origin.x)}
              cy={yScale(origin.y)}
              r={5}
              fill={ruleColor(warp.rules.origin)}
              stroke={VIZ.surface}
              strokeWidth={2}
            />
            <text
              x={xScale(origin.x) + 8}
              y={yScale(origin.y) - 8}
              fontSize={11}
              fontFamily="var(--font-mono), monospace"
              fill={ruleColor(warp.rules.origin)}
            >
              T(0,0)
            </text>
          </svg>
        </div>

        <div className="rounded-(--radius-card) border border-line bg-surface px-3 py-2.5">
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <Rule
              label="origin fixed"
              ok={warp.rules.origin}
              colorOk={ID_COLOR}
            />
            <Rule label="lines → lines" ok={warp.rules.parallel} />
            <Rule label="even spacing" ok={warp.rules.spacing} />
          </div>
          <p className="mt-3 text-[12px] leading-snug text-mute">
            {warp.note}
          </p>
        </div>
      </div>
    </figure>
  )
}

function Rule({
  label,
  ok,
  colorOk = VIZ.teal,
}: {
  label: string
  ok: boolean
  colorOk?: string
}) {
  return (
    <div
      className="flex items-center gap-1.5 border-l-2 pl-2"
      style={{ borderColor: ok ? colorOk : VIZ.coral }}
    >
      <span
        aria-hidden
        style={{ color: ok ? colorOk : VIZ.coral }}
        className="font-bold"
      >
        {ok ? '✓' : '✗'}
      </span>
      <span className="text-mute">{label}</span>
    </div>
  )
}
