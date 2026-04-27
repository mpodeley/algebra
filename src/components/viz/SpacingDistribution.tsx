import { useEffect, useMemo, useRef, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { sampleGOEEigenvalues } from '../../lib/math/randomMatrix'

const N_GOE = 64
const N_POISSON = 64
const BINS = 32
const X_RANGE: [number, number] = [0, 3.2]
const Y_RANGE: [number, number] = [0, 1.0]
const WIDTH = 480
const HEIGHT = 300
const PAD_X = 40
const PAD_Y = 24
const MAX_SAMPLES = 400

const xScale = scaleLinear().domain(X_RANGE).range([PAD_X, WIDTH - PAD_X])
const yScale = scaleLinear().domain(Y_RANGE).range([HEIGHT - PAD_Y, PAD_Y])
const BIN_WIDTH = (X_RANGE[1] - X_RANGE[0]) / BINS

function wignerSurmise(s: number): number {
  return (Math.PI / 2) * s * Math.exp((-Math.PI * s * s) / 4)
}
function poissonDensity(s: number): number {
  return Math.exp(-s)
}

function gapsFromSorted(sorted: number[]): number[] {
  const skip = Math.floor(sorted.length * 0.2)
  const gaps: number[] = []
  for (let i = skip; i < sorted.length - 1 - skip; i++) {
    gaps.push(sorted[i + 1] - sorted[i])
  }
  if (gaps.length === 0) return []
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length
  return gaps.map((g) => g / mean)
}

function poissonSample(N: number): number[] {
  const arr: number[] = []
  for (let i = 0; i < N; i++) arr.push(Math.random() * N)
  arr.sort((a, b) => a - b)
  return gapsFromSorted(arr)
}

type Mode = 'goe' | 'poisson'

export function SpacingDistribution() {
  const [mode, setMode] = useState<Mode>('goe')
  const [gaps, setGaps] = useState<number[]>([])
  const [samples, setSamples] = useState(0)
  const [autoplay, setAutoplay] = useState(false)

  // Reset when mode changes
  useEffect(() => {
    setGaps([])
    setSamples(0)
  }, [mode])

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
        const newGaps =
          mode === 'goe' ? goeSampleGaps() : poissonSample(N_POISSON)
        setGaps((cur) => cur.concat(newGaps))
        return prev + 1
      })
    }, 200)
    return () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [autoplay, mode])

  function goeSampleGaps() {
    const eigs = sampleGOEEigenvalues(N_GOE)
    return gapsFromSorted(eigs)
  }

  function generateBatch(count: number) {
    let acc: number[] = []
    for (let i = 0; i < count; i++) {
      acc = acc.concat(
        mode === 'goe' ? goeSampleGaps() : poissonSample(N_POISSON),
      )
    }
    setGaps((cur) => cur.concat(acc))
    setSamples((p) => p + count)
  }

  function reset() {
    setGaps([])
    setSamples(0)
    setAutoplay(false)
  }

  const bins = useMemo(() => {
    const counts = new Array(BINS).fill(0) as number[]
    for (const v of gaps) {
      const idx = Math.floor((v - X_RANGE[0]) / BIN_WIDTH)
      if (idx >= 0 && idx < BINS) counts[idx]++
    }
    if (gaps.length === 0) return counts
    return counts.map((c) => c / (gaps.length * BIN_WIDTH))
  }, [gaps])

  const wignerPath = useMemo(() => buildPath(wignerSurmise), [])
  const poissonPath = useMemo(() => buildPath(poissonDensity), [])

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMode('goe')}
              className={`rounded-(--radius-button) border px-3 py-1 text-[12px] font-mono transition-colors ${
                mode === 'goe'
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line text-mute hover:border-accent hover:text-accent'
              }`}
            >
              GOE
            </button>
            <button
              type="button"
              onClick={() => setMode('poisson')}
              className={`rounded-(--radius-button) border px-3 py-1 text-[12px] font-mono transition-colors ${
                mode === 'poisson'
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line text-mute hover:border-accent hover:text-accent'
              }`}
            >
              Poisson
            </button>
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
            <line
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={HEIGHT - PAD_Y}
              y2={HEIGHT - PAD_Y}
              stroke={VIZ.lineStrong}
              strokeWidth={1}
            />
            {[0, 1, 2, 3].map((t) => (
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

            {/* histogram */}
            {bins.map((density, i) => {
              const x0 = X_RANGE[0] + i * BIN_WIDTH
              const x1 = x0 + BIN_WIDTH
              const px0 = xScale(x0)
              const px1 = xScale(x1)
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

            {/* both theoretical curves; the active mode is drawn bolder */}
            <path
              d={wignerPath}
              fill="none"
              stroke={VIZ.coral}
              strokeWidth={mode === 'goe' ? 2.5 : 1.25}
              strokeOpacity={mode === 'goe' ? 1 : 0.4}
              strokeLinecap="round"
            />
            <path
              d={poissonPath}
              fill="none"
              stroke={VIZ.amber}
              strokeWidth={mode === 'poisson' ? 2.5 : 1.25}
              strokeOpacity={mode === 'poisson' ? 1 : 0.4}
              strokeLinecap="round"
              strokeDasharray="6 4"
            />

            {/* legend */}
            <g transform={`translate(${WIDTH - PAD_X - 130}, ${PAD_Y + 4})`}>
              <line
                x1={0}
                y1={4}
                x2={18}
                y2={4}
                stroke={VIZ.coral}
                strokeWidth={2}
              />
              <text
                x={24}
                y={8}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.coral}
              >
                Wigner (GOE)
              </text>
              <line
                x1={0}
                y1={20}
                x2={18}
                y2={20}
                stroke={VIZ.amber}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
              <text
                x={24}
                y={24}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.amber}
              >
                Poisson (e^−s)
              </text>
            </g>
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
            {gaps.length.toLocaleString()} gaps
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

function buildPath(fn: (s: number) => number): string {
  const N_PTS = 200
  const pts: string[] = []
  for (let i = 0; i <= N_PTS; i++) {
    const s = X_RANGE[0] + ((X_RANGE[1] - X_RANGE[0]) * i) / N_PTS
    const y = Math.min(fn(s), Y_RANGE[1])
    pts.push(`${i === 0 ? 'M' : 'L'} ${xScale(s).toFixed(1)},${yScale(y).toFixed(1)}`)
  }
  return pts.join(' ')
}
