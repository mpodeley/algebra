import { useEffect, useId, useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { EqBlock } from '../ui/Equation'
import { Slider } from '../ui/Slider'
import { Arrow, Arrowhead, type Vec } from './primitives'

const SIZE = 480
const PAD = 28
const DOMAIN: [number, number] = [-5.2, 5.2]
const GRID = 5

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral

type Matrix = { a: number; b: number; c: number; d: number }

const IDENTITY: Matrix = { a: 1, b: 0, c: 0, d: 1 }

const cos30 = Math.cos(Math.PI / 6)
const sin30 = Math.sin(Math.PI / 6)
const cos45 = Math.SQRT1_2
const sin45 = Math.SQRT1_2

const PRESETS: Array<{ id: string; label: string; m: Matrix }> = [
  { id: 'I', label: 'identity', m: IDENTITY },
  {
    id: 'R30',
    label: 'rotate 30°',
    m: { a: cos30, b: -sin30, c: sin30, d: cos30 },
  },
  {
    id: 'R45',
    label: 'rotate 45°',
    m: { a: cos45, b: -sin45, c: sin45, d: cos45 },
  },
  {
    id: 'R90',
    label: 'rotate 90°',
    m: { a: 0, b: -1, c: 1, d: 0 },
  },
  {
    id: 'shear',
    label: 'shear x',
    m: { a: 1, b: 1, c: 0, d: 1 },
  },
  {
    id: 'scale',
    label: 'scale 1.5×',
    m: { a: 1.5, b: 0, c: 0, d: 1.5 },
  },
  {
    id: 'flip',
    label: 'flip y',
    m: { a: 1, b: 0, c: 0, d: -1 },
  },
]

function findPreset(id: string): Matrix {
  return PRESETS.find((p) => p.id === id)?.m ?? IDENTITY
}

function multiply(a: Matrix, b: Matrix): Matrix {
  return {
    a: a.a * b.a + a.b * b.c,
    b: a.a * b.b + a.b * b.d,
    c: a.c * b.a + a.d * b.c,
    d: a.c * b.b + a.d * b.d,
  }
}

function lerpMatrix(m1: Matrix, m2: Matrix, t: number): Matrix {
  return {
    a: m1.a * (1 - t) + m2.a * t,
    b: m1.b * (1 - t) + m2.b * t,
    c: m1.c * (1 - t) + m2.c * t,
    d: m1.d * (1 - t) + m2.d * t,
  }
}

function fmtMatrixTex(label: string, m: Matrix) {
  return `${label} = \\begin{bmatrix} ${m.a.toFixed(2)} & ${m.b.toFixed(
    2,
  )} \\\\ ${m.c.toFixed(2)} & ${m.d.toFixed(2)} \\end{bmatrix}`
}

/**
 * Two preset transformations M1 and M2; time-scrub through identity → M1 →
 * M2·M1 (i.e. apply M1 first, then M2). Demonstrates that the composition
 * is itself a linear transformation, and that order matters.
 */
export function CompositeTransform() {
  const [m1Id, setM1Id] = useState('R30')
  const [m2Id, setM2Id] = useState('shear')
  const [t, setT] = useState(2)
  const [playing, setPlaying] = useState(false)
  const clipId = useId()

  const m1 = findPreset(m1Id)
  const m2 = findPreset(m2Id)
  const composed = useMemo(() => multiply(m2, m1), [m1, m2])
  const reversed = useMemo(() => multiply(m1, m2), [m1, m2])

  const effective = useMemo(() => {
    if (t <= 1) return lerpMatrix(IDENTITY, m1, t)
    return lerpMatrix(m1, composed, t - 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, m1.a, m1.b, m1.c, m1.d, composed.a, composed.b, composed.c, composed.d])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setT((prev) => {
        const next = prev + dt * 0.6
        if (next >= 2) {
          setPlaying(false)
          return 2
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  function play() {
    setT(0)
    requestAnimationFrame(() => setPlaying(true))
  }

  const iHat: Vec = { x: effective.a, y: effective.c }
  const jHat: Vec = { x: effective.b, y: effective.d }

  // Cells / lines computed from effective matrix.
  const apply = (p: Vec): Vec => ({
    x: p.x * iHat.x + p.y * jHat.x,
    y: p.x * iHat.y + p.y * jHat.y,
  })

  const { cells, lines } = useMemo(() => {
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

    return { cells, lines }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective.a, effective.b, effective.c, effective.d])

  const stepLabel =
    t < 0.05
      ? 'identity'
      : t > 1.95
        ? 'M₂ ∘ M₁ (composed)'
        : t < 1
          ? 'applying M₁'
          : t === 1
            ? 'after M₁'
            : 'applying M₂'

  const ordersDiffer =
    Math.hypot(
      composed.a - reversed.a,
      composed.b - reversed.b,
      composed.c - reversed.c,
      composed.d - reversed.d,
    ) > 0.01

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <PresetSelect
            label="M₁ (applied first)"
            value={m1Id}
            onChange={setM1Id}
            color={I_COLOR}
          />
          <PresetSelect
            label="M₂ (applied second)"
            value={m2Id}
            onChange={setM2Id}
            color={J_COLOR}
          />
        </div>
      </div>

      <div className="mx-auto mt-6 aspect-square w-full max-w-[480px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-full w-full"
        >
          <defs>
            <Arrowhead id="ct-i" color={I_COLOR} />
            <Arrowhead id="ct-j" color={J_COLOR} />
            <clipPath id={clipId}>
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
          </g>

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

          <Arrow
            head={iHat}
            color={I_COLOR}
            markerId="ct-i"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="ct-j"
            xs={xScale}
            ys={yScale}
          />
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Slider
              label="t (time)"
              min={0}
              max={2}
              step={0.01}
              value={t}
              onChange={(next) => {
                setPlaying(false)
                setT(next)
              }}
              display={`${stepLabel}`}
            />
          </div>
          <button
            type="button"
            onClick={play}
            disabled={playing}
            className="rounded-(--radius-button) border border-line px-3 py-2 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {playing ? '…' : 'play'}
          </button>
        </div>

        <div className="rounded-(--radius-card) border border-line bg-surface px-4 py-3">
          <EqBlock tex={fmtMatrixTex('\\mathbf{M_1}', m1)} />
          <EqBlock tex={fmtMatrixTex('\\mathbf{M_2}', m2)} />
          <EqBlock
            tex={fmtMatrixTex('\\mathbf{M_2 M_1}', composed)}
          />
        </div>

        {ordersDiffer && (
          <p className="text-[12px] leading-snug text-mute">
            <span style={{ color: VIZ.coral }}>Order matters.</span> The
            other order, M₁ M₂, gives a different matrix:{' '}
            <span className="font-mono">
              [{reversed.a.toFixed(2)}, {reversed.b.toFixed(2)};{' '}
              {reversed.c.toFixed(2)}, {reversed.d.toFixed(2)}]
            </span>
            . Try swapping the dropdowns.
          </p>
        )}
      </div>
    </figure>
  )
}

function PresetSelect({
  label,
  value,
  onChange,
  color,
}: {
  label: string
  value: string
  onChange: (id: string) => void
  color: string
}) {
  return (
    <label className="block">
      <span
        className="mb-1 block font-mono text-[11px] uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-(--radius-button) border border-line bg-surface px-2 py-2 text-[13px] text-ink focus:border-accent focus:outline-none"
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  )
}
