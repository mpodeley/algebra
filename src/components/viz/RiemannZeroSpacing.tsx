import { useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import {
  RIEMANN_ZEROS,
  unfoldedSpacings,
} from '../../lib/math/riemannZeros'

const WIDTH = 480
const HEIGHT = 300
const PAD_X = 40
const PAD_Y = 24
const X_RANGE: [number, number] = [0, 3.2]
const Y_RANGE: [number, number] = [0, 1.0]
const BINS = 24

const xScale = scaleLinear().domain(X_RANGE).range([PAD_X, WIDTH - PAD_X])
const yScale = scaleLinear().domain(Y_RANGE).range([HEIGHT - PAD_Y, PAD_Y])
const BIN_WIDTH = (X_RANGE[1] - X_RANGE[0]) / BINS

function gueSurmise(s: number) {
  return (32 / (Math.PI * Math.PI)) * s * s * Math.exp((-4 * s * s) / Math.PI)
}
function gor(s: number) {
  return (Math.PI / 2) * s * Math.exp((-Math.PI * s * s) / 4)
}
function poisson(s: number) {
  return Math.exp(-s)
}

export function RiemannZeroSpacing() {
  const spacings = useMemo(() => unfoldedSpacings(RIEMANN_ZEROS), [])

  const bins = useMemo(() => {
    const counts = new Array(BINS).fill(0) as number[]
    for (const v of spacings) {
      const idx = Math.floor((v - X_RANGE[0]) / BIN_WIDTH)
      if (idx >= 0 && idx < BINS) counts[idx]++
    }
    return counts.map((c) => c / (spacings.length * BIN_WIDTH))
  }, [spacings])

  const guePath = useMemo(() => buildPath(gueSurmise), [])
  const goePath = useMemo(() => buildPath(gor), [])
  const poissonPath = useMemo(() => buildPath(poisson), [])

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-2">
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
            {[0, 1, 2, 3].map((t) => (
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
                  fillOpacity={0.5}
                />
              )
            })}

            {/* GUE prediction (the one that fits) */}
            <path
              d={guePath}
              fill="none"
              stroke={VIZ.coral}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* GOE & Poisson — drawn faintly for contrast */}
            <path
              d={goePath}
              fill="none"
              stroke={VIZ.amber}
              strokeWidth={1.25}
              strokeOpacity={0.4}
              strokeDasharray="3 4"
            />
            <path
              d={poissonPath}
              fill="none"
              stroke={VIZ.purple}
              strokeWidth={1.25}
              strokeOpacity={0.4}
              strokeDasharray="3 4"
            />

            <g transform={`translate(${WIDTH - PAD_X - 130}, ${PAD_Y + 4})`}>
              <line x1={0} y1={4} x2={18} y2={4} stroke={VIZ.coral} strokeWidth={2.5} />
              <text x={24} y={8} fontSize={11} fontFamily="var(--font-mono), monospace" fill={VIZ.coral}>
                GUE (β = 2)
              </text>
              <line x1={0} y1={20} x2={18} y2={20} stroke={VIZ.amber} strokeWidth={1.5} strokeDasharray="3 3" />
              <text x={24} y={24} fontSize={11} fontFamily="var(--font-mono), monospace" fill={VIZ.amber} opacity={0.7}>
                GOE (β = 1)
              </text>
              <line x1={0} y1={36} x2={18} y2={36} stroke={VIZ.purple} strokeWidth={1.5} strokeDasharray="3 3" />
              <text x={24} y={40} fontSize={11} fontFamily="var(--font-mono), monospace" fill={VIZ.purple} opacity={0.7}>
                Poisson
              </text>
            </g>
          </svg>
        </div>
        <p className="text-center font-mono text-[11px] text-mute">
          {RIEMANN_ZEROS.length} Riemann zeros · {spacings.length} unfolded
          spacings
        </p>
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
