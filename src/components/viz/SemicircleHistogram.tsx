import { useEffect, useMemo, useRef, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { sampleGOEEigenvalues } from '../../lib/math/randomMatrix'

const N_OPTIONS = [4, 8, 16, 32, 64] as const
const BINS = 40
const X_RANGE: [number, number] = [-2.6, 2.6]
const Y_RANGE: [number, number] = [0, 0.45]
const WIDTH = 480
const HEIGHT = 300
const PAD_X = 40
const PAD_Y = 24

const xScale = scaleLinear().domain(X_RANGE).range([PAD_X, WIDTH - PAD_X])
const yScale = scaleLinear().domain(Y_RANGE).range([HEIGHT - PAD_Y, PAD_Y])
const BIN_WIDTH = (X_RANGE[1] - X_RANGE[0]) / BINS
const MAX_SAMPLES = 400 // upper bound on autoplay accumulation

function semicircle(lambda: number): number {
  if (lambda <= -2 || lambda >= 2) return 0
  return (1 / (2 * Math.PI)) * Math.sqrt(4 - lambda * lambda)
}

export function SemicircleHistogram() {
  const [N, setN] = useState<(typeof N_OPTIONS)[number]>(32)
  const [eigs, setEigs] = useState<number[]>([])
  const [samples, setSamples] = useState(0)
  const [autoplay, setAutoplay] = useState(false)

  // Reset whenever N changes.
  useEffect(() => {
    setEigs([])
    setSamples(0)
  }, [N])

  // Autoplay loop: add one sample every interval, stop at MAX_SAMPLES.
  const autoplayRef = useRef<number | null>(null)
  useEffect(() => {
    if (!autoplay) {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
      return
    }
    const intervalMs = N <= 16 ? 80 : N <= 32 ? 140 : 220
    autoplayRef.current = window.setInterval(() => {
      setSamples((prev) => {
        if (prev >= MAX_SAMPLES) {
          setAutoplay(false)
          return prev
        }
        const newEigs = sampleGOEEigenvalues(N)
        setEigs((cur) => cur.concat(newEigs))
        return prev + 1
      })
    }, intervalMs)
    return () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [autoplay, N])

  function generateBatch(count: number) {
    let acc: number[] = []
    for (let i = 0; i < count; i++) {
      acc = acc.concat(sampleGOEEigenvalues(N))
    }
    setEigs((cur) => cur.concat(acc))
    setSamples((prev) => prev + count)
  }

  function reset() {
    setEigs([])
    setSamples(0)
    setAutoplay(false)
  }

  // Build histogram bins.
  const bins = useMemo(() => {
    const counts = new Array(BINS).fill(0) as number[]
    for (const v of eigs) {
      const idx = Math.floor((v - X_RANGE[0]) / BIN_WIDTH)
      if (idx >= 0 && idx < BINS) counts[idx]++
    }
    if (eigs.length === 0) return counts
    return counts.map((c) => c / (eigs.length * BIN_WIDTH))
  }, [eigs])

  // Theoretical curve sampled at fine resolution.
  const semicirclePath = useMemo(() => {
    const N_PTS = 240
    const pts: string[] = []
    for (let i = 0; i <= N_PTS; i++) {
      const lambda = X_RANGE[0] + ((X_RANGE[1] - X_RANGE[0]) * i) / N_PTS
      const y = semicircle(lambda)
      const px = xScale(lambda).toFixed(1)
      const py = yScale(y).toFixed(1)
      pts.push(`${i === 0 ? 'M' : 'L'} ${px},${py}`)
    }
    return pts.join(' ')
  }, [])

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
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
                N={n}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => generateBatch(10)}
            className="rounded-(--radius-button) border border-line px-2.5 py-1 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            +10
          </button>
        </div>

        <div className="rounded-(--radius-card) border border-line bg-surface p-3">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block w-full"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          >
            {/* axes */}
            <line
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={HEIGHT - PAD_Y}
              y2={HEIGHT - PAD_Y}
              stroke={VIZ.lineStrong}
              strokeWidth={1}
            />
            {/* x-axis ticks */}
            {[-2, -1, 0, 1, 2].map((t) => (
              <g key={t}>
                <line
                  x1={xScale(t)}
                  x2={xScale(t)}
                  y1={HEIGHT - PAD_Y}
                  y2={HEIGHT - PAD_Y + 5}
                  stroke={VIZ.mute}
                  strokeWidth={1}
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

            {/* histogram bars */}
            {bins.map((density, i) => {
              const x0 = X_RANGE[0] + i * BIN_WIDTH
              const x1 = x0 + BIN_WIDTH
              const px0 = xScale(x0)
              const px1 = xScale(x1)
              const py = yScale(density)
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

            {/* theoretical semicircle */}
            <path
              d={semicirclePath}
              fill="none"
              stroke={VIZ.coral}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={xScale(0)}
              y={yScale(semicircle(0)) - 8}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.coral}
            >
              ½π · √(4 − λ²) / π
            </text>
          </svg>
        </div>

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
            {samples} sample{samples === 1 ? '' : 's'} ·{' '}
            {eigs.length.toLocaleString()} eigenvalues
            {samples >= MAX_SAMPLES && ' · (cap reached)'}
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
    </figure>
  )
}
