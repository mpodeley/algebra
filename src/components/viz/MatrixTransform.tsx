import { useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { EqBlock } from '../ui/Equation'
import { Slider } from '../ui/Slider'
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
const DOMAIN: [number, number] = [-5.2, 5.2]
const GRID = 5

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral

type Matrix = { a: number; b: number; c: number; d: number }
type Which = 'i' | 'j'

const IDENTITY: Matrix = { a: 1, b: 0, c: 0, d: 1 }

/**
 * Linear-transformation explorer. The matrix [[a b][c d]] is the source of
 * truth: column 1 is the image of î, column 2 is the image of ĵ. Drag the
 * basis-vector handles or move the four sliders — both edit the same state.
 *
 * Adds two pieces of information that GridTransform leaves implicit:
 * the matrix written in standard form, and the determinant a·d − b·c.
 */
export function MatrixTransform() {
  const [m, setM] = useState<Matrix>(IDENTITY)
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const clipId = useId()

  // Columns of M are images of î and ĵ.
  const iHat: Vec = { x: m.a, y: m.c }
  const jHat: Vec = { x: m.b, y: m.d }

  const det = m.a * m.d - m.b * m.c

  const apply = (p: Vec): Vec => ({
    x: p.x * iHat.x + p.y * jHat.x,
    y: p.x * iHat.y + p.y * jHat.y,
  })

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

    const unitSquarePts = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
      .map((p) => apply(p))
      .map((p) => `${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
      .join(' ')

    return { cells, lines, unitSquarePts }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.a, m.b, m.c, m.d])

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
    if (active === 'i') setM((prev) => ({ ...prev, a: p.x, c: p.y }))
    else setM((prev) => ({ ...prev, b: p.x, d: p.y }))
  }
  function endDrag() {
    setActive(null)
  }
  function reset() {
    setM(IDENTITY)
  }

  // KaTeX matrix display, rebuilt on each change.
  const matrixTex = useMemo(
    () =>
      `\\mathbf{M} = \\begin{bmatrix} ${m.a.toFixed(2)} & ${m.b.toFixed(
        2,
      )} \\\\ ${m.c.toFixed(2)} & ${m.d.toFixed(2)} \\end{bmatrix}`,
    [m.a, m.b, m.c, m.d],
  )

  const detColor =
    Math.abs(det) < 0.02 ? VIZ.mute : det < 0 ? VIZ.coral : VIZ.ink

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
            <Arrowhead id="mt-i" color={I_COLOR} />
            <Arrowhead id="mt-j" color={J_COLOR} />
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
            <polygon
              points={unitSquarePts}
              fill={det < 0 ? VIZ.coral : VIZ.teal}
              fillOpacity={0.18}
              stroke={det < 0 ? VIZ.coral : VIZ.teal}
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
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
            markerId="mt-i"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="mt-j"
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

      <div className="mx-auto mt-4 max-w-[480px] space-y-4">
        <div className="rounded-(--radius-card) border border-line bg-surface px-4 py-3">
          <EqBlock tex={matrixTex} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Slider
            label="a (î.x)"
            min={-3}
            max={3}
            step={0.05}
            value={m.a}
            onChange={(a) => setM((p) => ({ ...p, a }))}
            display={m.a.toFixed(2)}
          />
          <Slider
            label="b (ĵ.x)"
            min={-3}
            max={3}
            step={0.05}
            value={m.b}
            onChange={(b) => setM((p) => ({ ...p, b }))}
            display={m.b.toFixed(2)}
          />
          <Slider
            label="c (î.y)"
            min={-3}
            max={3}
            step={0.05}
            value={m.c}
            onChange={(c) => setM((p) => ({ ...p, c }))}
            display={m.c.toFixed(2)}
          />
          <Slider
            label="d (ĵ.y)"
            min={-3}
            max={3}
            step={0.05}
            value={m.d}
            onChange={(d) => setM((p) => ({ ...p, d }))}
            display={m.d.toFixed(2)}
          />
        </div>

        <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-[12px]">
          <span className="text-mute">
            det(M) = a · d − b · c ={' '}
            <span style={{ color: detColor }}>{det.toFixed(3)}</span>
          </span>
          <button
            type="button"
            onClick={reset}
            className="rounded-(--radius-button) border border-line px-2.5 py-1 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            reset
          </button>
        </div>
        {Math.abs(det) < 0.02 ? (
          <p className="text-[12px] text-mute">
            The grid has collapsed onto a line — the unit square is gone.
          </p>
        ) : det < 0 ? (
          <p className="text-[12px] text-mute">
            Orientation flipped: a region traversed counterclockwise now
            traverses clockwise.
          </p>
        ) : null}
      </div>
    </figure>
  )
}
