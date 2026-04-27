import { useEffect, useMemo, useRef, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { multiply, transpose } from 'mathjs'
import { VIZ } from '../../lib/viz/colors'
import {
  eigenvaluesOf,
  gaussianSample,
} from '../../lib/math/randomMatrix'
import { Slider } from '../ui/Slider'

const WIDTH = 480
const HEIGHT = 300
const PAD_X = 40
const PAD_Y = 24
const X_RANGE: [number, number] = [0, 4.5]
const Y_RANGE: [number, number] = [0, 1.5]
const BINS = 40
const N = 32 // matrix size; T varies via q
const MAX_SAMPLES = 200

const xScale = scaleLinear().domain(X_RANGE).range([PAD_X, WIDTH - PAD_X])
const yScale = scaleLinear().domain(Y_RANGE).range([HEIGHT - PAD_Y, PAD_Y])
const BIN_WIDTH = (X_RANGE[1] - X_RANGE[0]) / BINS

function generateGaussianRect(rows: number, cols: number): number[][] {
  const M: number[][] = Array.from({ length: rows }, () => new Array(cols))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      M[i][j] = gaussianSample()
    }
  }
  return M
}

/** Sample covariance eigenvalues for a single (N×T) Gaussian matrix R. */
function sampleCovEigenvalues(N: number, T: number): number[] {
  const R = generateGaussianRect(N, T)
  // C = (1/T) R R^T
  const RRt = multiply(R, transpose(R)) as unknown as number[][]
  const eigs = eigenvaluesOf(RRt).map((e) => e / T)
  return eigs
}

/** Marchenko-Pastur density for σ² = 1, ratio q = N/T. */
function mpDensity(lambda: number, q: number): number {
  const lambdaPlus = Math.pow(1 + Math.sqrt(q), 2)
  const lambdaMinus = Math.pow(1 - Math.sqrt(q), 2)
  if (lambda <= lambdaMinus || lambda >= lambdaPlus) return 0
  return (
    (1 / (2 * Math.PI * q * Math.max(lambda, 1e-9))) *
    Math.sqrt((lambdaPlus - lambda) * (lambda - lambdaMinus))
  )
}

export function MarchenkoPastur() {
  const [q, setQ] = useState(0.5)
  const [eigs, setEigs] = useState<number[]>([])
  const [samples, setSamples] = useState(0)
  const [autoplay, setAutoplay] = useState(false)

  const T = Math.max(1, Math.round(N / q))

  useEffect(() => {
    setEigs([])
    setSamples(0)
  }, [q])

  const autoplayRef = useRef<number | null>(null)
  useEffect(() => {
    if (!autoplay) {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
      return
    }
    autoplayRef.current = window.setInterval(() => {
      setSamples((prev) => {
        if (prev >= MAX_SAMPLES) {
          setAutoplay(false)
          return prev
        }
        const newEigs = sampleCovEigenvalues(N, T)
        setEigs((cur) => cur.concat(newEigs))
        return prev + 1
      })
    }, 220)
    return () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [autoplay, T])

  function reset() {
    setEigs([])
    setSamples(0)
    setAutoplay(false)
  }

  const bins = useMemo(() => {
    const counts = new Array(BINS).fill(0) as number[]
    for (const v of eigs) {
      const idx = Math.floor((v - X_RANGE[0]) / BIN_WIDTH)
      if (idx >= 0 && idx < BINS) counts[idx]++
    }
    if (eigs.length === 0) return counts
    return counts.map((c) => c / (eigs.length * BIN_WIDTH))
  }, [eigs])

  const mpPath = useMemo(() => {
    const N_PTS = 240
    const pts: string[] = []
    for (let i = 0; i <= N_PTS; i++) {
      const lambda = X_RANGE[0] + ((X_RANGE[1] - X_RANGE[0]) * i) / N_PTS
      const y = Math.min(mpDensity(lambda, q), Y_RANGE[1])
      pts.push(
        `${i === 0 ? 'M' : 'L'} ${xScale(lambda).toFixed(1)},${yScale(y).toFixed(1)}`,
      )
    }
    return pts.join(' ')
  }, [q])

  const lambdaPlus = Math.pow(1 + Math.sqrt(q), 2)
  const lambdaMinus = Math.pow(1 - Math.sqrt(q), 2)

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
        <div className="rounded-(--radius-card) border border-line bg-surface p-3">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block w-full"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          >
            <line
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={HEIGHT - PAD_Y}
              y2={HEIGHT - PAD_Y}
              stroke={VIZ.lineStrong}
            />
            {[0, 1, 2, 3, 4].map((t) => (
              <g key={t}>
                <line
                  x1={xScale(t)}
                  x2={xScale(t)}
                  y1={HEIGHT - PAD_Y}
                  y2={HEIGHT - PAD_Y + 5}
                  stroke={VIZ.mute}
                />
                <text
                  x={xScale(t)}
                  y={HEIGHT - PAD_Y + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="var(--font-mono), monospace"
                  fill={VIZ.mute}
                >
                  {t}
                </text>
              </g>
            ))}

            {bins.map((density, i) => {
              const x0 = X_RANGE[0] + i * BIN_WIDTH
              const px0 = xScale(x0)
              const px1 = xScale(x0 + BIN_WIDTH)
              const py = yScale(Math.min(density, Y_RANGE[1]))
              const baseline = yScale(0)
              if (density <= 0) return null
              return (
                <rect
                  key={i}
                  x={px0 + 0.5}
                  y={py}
                  width={px1 - px0 - 1}
                  height={baseline - py}
                  fill={VIZ.teal}
                  fillOpacity={0.45}
                />
              )
            })}

            <path
              d={mpPath}
              fill="none"
              stroke={VIZ.coral}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* edges */}
            <line
              x1={xScale(lambdaMinus)}
              x2={xScale(lambdaMinus)}
              y1={HEIGHT - PAD_Y}
              y2={PAD_Y}
              stroke={VIZ.coral}
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="2 4"
            />
            <line
              x1={xScale(lambdaPlus)}
              x2={xScale(lambdaPlus)}
              y1={HEIGHT - PAD_Y}
              y2={PAD_Y}
              stroke={VIZ.coral}
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="2 4"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <Slider
            label="q = N / T"
            min={0.1}
            max={1.0}
            step={0.05}
            value={q}
            onChange={setQ}
            display={`q = ${q.toFixed(2)} (T = ${T})`}
          />
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setAutoplay((v) => !v)}
              disabled={samples >= MAX_SAMPLES && !autoplay}
              className="rounded-(--radius-button) bg-accent px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {autoplay ? 'pause' : 'autoplay'}
            </button>
            <p className="font-mono text-[11px] text-mute">
              support: [{lambdaMinus.toFixed(2)}, {lambdaPlus.toFixed(2)}]{' '}
              · {samples} sample{samples === 1 ? '' : 's'}
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-(--radius-button) border border-line px-2.5 py-1 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent"
            >
              reset
            </button>
          </div>
        </div>
      </div>
    </figure>
  )
}
