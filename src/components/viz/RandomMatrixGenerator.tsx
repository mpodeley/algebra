import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import {
  eigenvaluesOf,
  generateGOE,
} from '../../lib/math/randomMatrix'

const HEATMAP_SIZE = 360 // px width / height of the heatmap
const NUMBER_LINE_WIDTH = 460
const NUMBER_LINE_HEIGHT = 80
const N_OPTIONS = [8, 16, 32, 64] as const

type Sample = {
  N: number
  matrix: number[][]
  eigenvalues: number[]
  maxAbs: number
}

function makeSample(N: number): Sample {
  const matrix = generateGOE(N)
  const eigenvalues = eigenvaluesOf(matrix)
  let maxAbs = 0
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const a = Math.abs(matrix[i][j])
      if (a > maxAbs) maxAbs = a
    }
  }
  return { N, matrix, eigenvalues, maxAbs: maxAbs || 1 }
}

function entryColor(v: number, maxAbs: number): string {
  const t = Math.max(-1, Math.min(1, v / maxAbs))
  // Diverging palette: coral for negative, surface for zero, blue for positive.
  if (t >= 0) {
    return `rgba(55, 138, 221, ${0.15 + 0.7 * t})`
  } else {
    return `rgba(216, 90, 48, ${0.15 + 0.7 * -t})`
  }
}

export function RandomMatrixGenerator() {
  const [N, setN] = useState<(typeof N_OPTIONS)[number]>(16)
  const [seed, setSeed] = useState(0)

  const sample = useMemo(
    () => makeSample(N),
    // re-sample whenever seed or N changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [N, seed],
  )

  const cellSize = HEATMAP_SIZE / sample.N

  const eigMin = Math.min(...sample.eigenvalues)
  const eigMax = Math.max(...sample.eigenvalues)
  const eigRange = Math.max(Math.abs(eigMin), Math.abs(eigMax)) * 1.15
  const xScale = scaleLinear()
    .domain([-eigRange, eigRange])
    .range([20, NUMBER_LINE_WIDTH - 20])

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {N_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setN(n)}
                className={`rounded-(--radius-button) border px-2.5 py-1 text-[12px] font-mono transition-colors ${
                  n === N
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-line text-mute hover:border-accent hover:text-accent'
                }`}
              >
                N = {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-(--radius-button) border border-line bg-accent px-3 py-1 text-[12px] font-medium text-white transition-opacity hover:opacity-90"
          >
            generate
          </button>
        </div>

        {/* Heatmap */}
        <div className="rounded-(--radius-card) border border-line bg-surface p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-mute">
            sample matrix (positive entries blue, negative coral)
          </p>
          <svg
            viewBox={`0 0 ${HEATMAP_SIZE} ${HEATMAP_SIZE}`}
            className="block aspect-square w-full max-w-[360px]"
          >
            {sample.matrix.flatMap((row, i) =>
              row.map((value, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={j * cellSize}
                  y={i * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={entryColor(value, sample.maxAbs)}
                />
              )),
            )}
          </svg>
        </div>

        {/* Eigenvalue number line */}
        <div className="rounded-(--radius-card) border border-line bg-surface p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-mute">
            spectrum — {sample.N} real eigenvalues, sorted
          </p>
          <svg
            viewBox={`0 0 ${NUMBER_LINE_WIDTH} ${NUMBER_LINE_HEIGHT}`}
            className="block w-full"
          >
            {/* axis */}
            <line
              x1={20}
              y1={NUMBER_LINE_HEIGHT / 2}
              x2={NUMBER_LINE_WIDTH - 20}
              y2={NUMBER_LINE_HEIGHT / 2}
              stroke={VIZ.lineStrong}
              strokeWidth={1}
            />
            {/* axis tick labels */}
            {[-eigRange, 0, eigRange].map((v, i) => (
              <g key={i}>
                <line
                  x1={xScale(v)}
                  x2={xScale(v)}
                  y1={NUMBER_LINE_HEIGHT / 2 - 4}
                  y2={NUMBER_LINE_HEIGHT / 2 + 4}
                  stroke={VIZ.mute}
                  strokeWidth={1}
                />
                <text
                  x={xScale(v)}
                  y={NUMBER_LINE_HEIGHT / 2 + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="var(--font-mono), monospace"
                  fill={VIZ.mute}
                >
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
            {/* eigenvalue ticks */}
            {sample.eigenvalues.map((lambda, i) => (
              <line
                key={i}
                x1={xScale(lambda)}
                x2={xScale(lambda)}
                y1={NUMBER_LINE_HEIGHT / 2 - 14}
                y2={NUMBER_LINE_HEIGHT / 2 + 14}
                stroke={VIZ.teal}
                strokeWidth={1.5}
                strokeOpacity={0.75}
              />
            ))}
          </svg>
        </div>
      </div>
    </figure>
  )
}
