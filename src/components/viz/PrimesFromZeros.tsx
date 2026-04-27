import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { chebyshevPsi, psiFromZeros } from '../../lib/math/primes'
import { RIEMANN_ZEROS } from '../../lib/math/riemannZeros'
import { Slider } from '../ui/Slider'

const WIDTH = 480
const HEIGHT = 320
const PAD_X = 44
const PAD_Y = 28
const X_RANGE: [number, number] = [2, 60]
const N_SAMPLES = 600
const MAX_ZEROS = Math.min(RIEMANN_ZEROS.length, 100)

const xScale = scaleLinear().domain(X_RANGE).range([PAD_X, WIDTH - PAD_X])

function buildPath(values: number[], xs: number[], ys: (n: number) => number) {
  const pts: string[] = []
  for (let i = 0; i < values.length; i++) {
    const x = xScale(xs[i]).toFixed(1)
    const y = ys(values[i]).toFixed(1)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`)
  }
  return pts.join(' ')
}

export function PrimesFromZeros() {
  const [N, setN] = useState(20)

  // Sample x once across the domain. ψ(x) is fixed; the approximation
  // depends on N, so it's the only thing that recomputes on slider change.
  const xs = useMemo(() => {
    const out: number[] = []
    for (let i = 0; i < N_SAMPLES; i++) {
      out.push(X_RANGE[0] + ((X_RANGE[1] - X_RANGE[0]) * i) / (N_SAMPLES - 1))
    }
    return out
  }, [])

  const psiTrue = useMemo(() => xs.map((x) => chebyshevPsi(x)), [xs])

  const psiApprox = useMemo(() => {
    const zeros = RIEMANN_ZEROS.slice(0, N)
    return xs.map((x) => psiFromZeros(x, zeros))
  }, [xs, N])

  const yMax = X_RANGE[1] + 4
  const yScale = scaleLinear().domain([0, yMax]).range([HEIGHT - PAD_Y, PAD_Y])

  const truePath = useMemo(
    () => buildPath(psiTrue, xs, yScale),
    [psiTrue, xs, yScale],
  )
  const approxPath = useMemo(
    () => buildPath(psiApprox, xs, yScale),
    [psiApprox, xs, yScale],
  )

  // The "y = x" reference, the leading-order term in the explicit formula.
  const leadingPath = useMemo(() => {
    const pts: string[] = []
    for (const x of [X_RANGE[0], X_RANGE[1]]) {
      pts.push(
        `${pts.length === 0 ? 'M' : 'L'} ${xScale(x).toFixed(1)},${yScale(x).toFixed(1)}`,
      )
    }
    return pts.join(' ')
  }, [yScale])

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
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
            />
            <line
              x1={PAD_X}
              x2={PAD_X}
              y1={PAD_Y}
              y2={HEIGHT - PAD_Y}
              stroke={VIZ.lineStrong}
            />

            {[10, 20, 30, 40, 50].map((t) => (
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
            {[10, 20, 30, 40, 50].map((t) => (
              <g key={`y${t}`}>
                <line
                  x1={PAD_X - 4}
                  x2={PAD_X}
                  y1={yScale(t)}
                  y2={yScale(t)}
                  stroke={VIZ.mute}
                />
                <text
                  x={PAD_X - 8}
                  y={yScale(t) + 4}
                  textAnchor="end"
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
              x
            </text>

            {/* y = x reference */}
            <path
              d={leadingPath}
              fill="none"
              stroke={VIZ.mute}
              strokeWidth={1}
              strokeOpacity={0.45}
              strokeDasharray="4 4"
            />

            {/* approximation from N zeros */}
            <path
              d={approxPath}
              fill="none"
              stroke={VIZ.coral}
              strokeWidth={2}
              strokeOpacity={0.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* true ψ(x) on top so the steps remain crisp */}
            <path
              d={truePath}
              fill="none"
              stroke={VIZ.teal}
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* legend */}
            <g transform={`translate(${WIDTH - PAD_X - 130}, ${PAD_Y + 4})`}>
              <line
                x1={0}
                y1={4}
                x2={18}
                y2={4}
                stroke={VIZ.teal}
                strokeWidth={2.25}
              />
              <text
                x={24}
                y={8}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.teal}
              >
                ψ(x) — primes
              </text>
              <line
                x1={0}
                y1={20}
                x2={18}
                y2={20}
                stroke={VIZ.coral}
                strokeWidth={2}
              />
              <text
                x={24}
                y={24}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.coral}
              >
                from {N} zero{N === 1 ? '' : 's'}
              </text>
              <line
                x1={0}
                y1={36}
                x2={18}
                y2={36}
                stroke={VIZ.mute}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={24}
                y={40}
                fontSize={11}
                fontFamily="var(--font-mono), monospace"
                fill={VIZ.mute}
              >
                y = x
              </text>
            </g>
          </svg>
        </div>

        <Slider
          label="zeros included (N)"
          min={0}
          max={MAX_ZEROS}
          step={1}
          value={N}
          onChange={(next) => setN(Math.round(next))}
          display={`${N} / ${MAX_ZEROS}`}
        />

        <p className="text-[12px] leading-snug text-mute">
          Each new zero is one more wave added to the coral curve. With{' '}
          <em>N = 0</em> the curve is the smooth leading term, almost{' '}
          <em>y = x</em>; the wiggle from a single zero already places
          a small bump near every prime power; by <em>N ≈ 30</em> the
          coral curve nearly tracks the teal step. The same zeros whose
          spacings we are about to histogram below are the harmonics
          this signal is built from.
        </p>
      </div>
    </figure>
  )
}
