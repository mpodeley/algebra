import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import {
  eigenvaluesOf,
  gaussianSample,
  matMul,
  matTranspose,
} from '../../lib/math/randomMatrix'
import { Slider } from '../ui/Slider'

const WIDTH = 480
const HEIGHT = 280
const PAD_X = 40
const PAD_Y = 28
const N_VALUES = [1, 2, 3, 4, 6, 8, 10, 12]
const SAMPLES_PER_N = 6

function generateGaussianNxN(N: number): number[][] {
  const M: number[][] = Array.from({ length: N }, () => new Array(N))
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      M[i][j] = gaussianSample()
    }
  }
  return M
}

function capacityFor(H: number[][], snrLinear: number): number {
  const N = H.length
  const HHt = matMul(H, matTranspose(H))
  const eigs = eigenvaluesOf(HHt)
  let cap = 0
  for (const lambda of eigs) {
    cap += Math.log2(1 + (snrLinear / N) * Math.max(lambda, 0))
  }
  return cap
}

export function MIMOCapacityDemo() {
  const [snrDb, setSnrDb] = useState(10)
  const [seed, setSeed] = useState(0)

  const snrLinear = Math.pow(10, snrDb / 10)

  const data = useMemo(() => {
    const points: Array<{ N: number; cap: number }> = []
    const means: Array<{ N: number; mean: number }> = []
    for (const N of N_VALUES) {
      let total = 0
      for (let s = 0; s < SAMPLES_PER_N; s++) {
        const H = generateGaussianNxN(N)
        const cap = capacityFor(H, snrLinear)
        total += cap
        points.push({ N, cap })
      }
      means.push({ N, mean: total / SAMPLES_PER_N })
    }
    return { points, means }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snrLinear, seed])

  const yMax = Math.max(...data.points.map((p) => p.cap), 1) * 1.1
  const xScale = scaleLinear()
    .domain([0, N_VALUES[N_VALUES.length - 1] + 1])
    .range([PAD_X, WIDTH - PAD_X])
  const yScale = scaleLinear()
    .domain([0, yMax])
    .range([HEIGHT - PAD_Y, PAD_Y])

  const meanPath = data.means
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'} ${xScale(p.N).toFixed(1)},${yScale(p.mean).toFixed(1)}`,
    )
    .join(' ')

  // Single-antenna baseline: log2(1 + ρ). The mean curve should sit
  // visibly above this, illustrating multi-antenna gain.
  const baselinePath = (() => {
    const pts: string[] = []
    for (const N of N_VALUES) {
      const y = N * Math.log2(1 + snrLinear)
      pts.push(
        `${pts.length === 0 ? 'M' : 'L'} ${xScale(N).toFixed(1)},${yScale(Math.min(y, yMax)).toFixed(1)}`,
      )
    }
    return pts.join(' ')
  })()

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
            <line
              x1={PAD_X}
              x2={PAD_X}
              y1={PAD_Y}
              y2={HEIGHT - PAD_Y}
              stroke={VIZ.lineStrong}
            />

            {[2, 4, 6, 8, 10, 12].map((t) => (
              <g key={t}>
                <line
                  x1={xScale(t)}
                  x2={xScale(t)}
                  y1={HEIGHT - PAD_Y}
                  y2={HEIGHT - PAD_Y + 4}
                  stroke={VIZ.mute}
                />
                <text
                  x={xScale(t)}
                  y={HEIGHT - PAD_Y + 16}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="var(--font-mono), monospace"
                  fill={VIZ.mute}
                >
                  {t}
                </text>
              </g>
            ))}
            <text
              x={WIDTH / 2}
              y={HEIGHT - 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.mute}
            >
              N (antennas)
            </text>
            <text
              x={12}
              y={PAD_Y - 6}
              fontSize={11}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.mute}
            >
              capacity (bits / use)
            </text>

            {data.points.map((p, i) => (
              <circle
                key={i}
                cx={xScale(p.N)}
                cy={yScale(p.cap)}
                r={2}
                fill={VIZ.teal}
                fillOpacity={0.5}
              />
            ))}

            <path
              d={meanPath}
              fill="none"
              stroke={VIZ.teal}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d={baselinePath}
              fill="none"
              stroke={VIZ.coral}
              strokeWidth={1.5}
              strokeOpacity={0.7}
              strokeDasharray="4 4"
            />

            <g transform={`translate(${WIDTH - PAD_X - 150}, ${PAD_Y + 4})`}>
              <line
                x1={0}
                y1={4}
                x2={18}
                y2={4}
                stroke={VIZ.teal}
                strokeWidth={2.5}
              />
              <text
                x={24}
                y={8}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.teal}
              >
                MIMO mean
              </text>
              <line
                x1={0}
                y1={20}
                x2={18}
                y2={20}
                stroke={VIZ.coral}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text
                x={24}
                y={24}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.coral}
              >
                N · log₂(1+ρ)
              </text>
            </g>
          </svg>
        </div>

        <div className="space-y-3">
          <Slider
            label="SNR (dB)"
            min={-5}
            max={25}
            step={0.5}
            value={snrDb}
            onChange={setSnrDb}
            display={`${snrDb.toFixed(1)} dB`}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="rounded-(--radius-button) border border-line px-2.5 py-1 text-[12px] text-mute transition-colors hover:border-accent hover:text-accent"
            >
              resample
            </button>
          </div>
        </div>
      </div>
    </figure>
  )
}
