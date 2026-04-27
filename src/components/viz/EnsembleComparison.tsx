import { useMemo } from 'react'
import { scaleLinear, scaleLog } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'

const WIDTH = 480
const HEIGHT = 300
const PAD_X = 40
const PAD_Y = 24
const X_RANGE: [number, number] = [0, 3.2]
const Y_RANGE: [number, number] = [0, 1.0]

const xScale = scaleLinear().domain(X_RANGE).range([PAD_X, WIDTH - PAD_X])
const yScale = scaleLinear().domain(Y_RANGE).range([HEIGHT - PAD_Y, PAD_Y])

const INSET_X_RANGE: [number, number] = [0.02, 1]
const INSET_Y_RANGE: [number, number] = [1e-4, 2]
const INSET_PAD = 14
const INSET_W = 200
const INSET_H = 140

const insetXScale = scaleLog()
  .domain(INSET_X_RANGE)
  .range([INSET_PAD, INSET_W - INSET_PAD])
const insetYScale = scaleLog()
  .domain(INSET_Y_RANGE)
  .range([INSET_H - INSET_PAD, INSET_PAD])

function P_GOE(s: number) {
  return (Math.PI / 2) * s * Math.exp((-Math.PI * s * s) / 4)
}
function P_GUE(s: number) {
  return (32 / (Math.PI * Math.PI)) * s * s * Math.exp((-4 * s * s) / Math.PI)
}
function P_GSE(s: number) {
  return (
    (262144 / (729 * Math.pow(Math.PI, 3))) *
    Math.pow(s, 4) *
    Math.exp((-64 * s * s) / (9 * Math.PI))
  )
}

const ENSEMBLES = [
  { name: 'GOE', beta: 1, color: VIZ.coral, fn: P_GOE },
  { name: 'GUE', beta: 2, color: VIZ.amber, fn: P_GUE },
  { name: 'GSE', beta: 4, color: VIZ.purple, fn: P_GSE },
] as const

export function EnsembleComparison() {
  const paths = useMemo(
    () =>
      ENSEMBLES.map(({ fn }) => buildPath(fn, X_RANGE, xScale, yScale, 240)),
    [],
  )

  const insetPaths = useMemo(
    () =>
      ENSEMBLES.map(({ fn }) =>
        buildLogPath(fn, INSET_X_RANGE, insetXScale, insetYScale, 200),
      ),
    [],
  )

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

            {ENSEMBLES.map((e, i) => (
              <path
                key={e.name}
                d={paths[i]}
                fill="none"
                stroke={e.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* legend */}
            <g transform={`translate(${WIDTH - PAD_X - 110}, ${PAD_Y + 4})`}>
              {ENSEMBLES.map((e, i) => (
                <g key={e.name} transform={`translate(0, ${i * 16})`}>
                  <line
                    x1={0}
                    y1={4}
                    x2={18}
                    y2={4}
                    stroke={e.color}
                    strokeWidth={2}
                  />
                  <text
                    x={24}
                    y={8}
                    fontSize={11}
                    fontFamily="var(--font-mono), monospace"
                    fill={e.color}
                  >
                    {e.name} (β = {e.beta})
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="rounded-(--radius-card) border border-line bg-surface p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-mute">
            small-s behavior, log-log
          </p>
          <svg
            viewBox={`0 0 ${INSET_W} ${INSET_H}`}
            className="block w-full max-w-[220px]"
          >
            {/* axes */}
            <line
              x1={INSET_PAD}
              x2={INSET_W - INSET_PAD}
              y1={INSET_H - INSET_PAD}
              y2={INSET_H - INSET_PAD}
              stroke={VIZ.lineStrong}
            />
            <line
              x1={INSET_PAD}
              x2={INSET_PAD}
              y1={INSET_PAD}
              y2={INSET_H - INSET_PAD}
              stroke={VIZ.lineStrong}
            />

            {ENSEMBLES.map((e, i) => (
              <path
                key={e.name}
                d={insetPaths[i]}
                fill="none"
                stroke={e.color}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}

            <text
              x={INSET_W - INSET_PAD - 4}
              y={INSET_H - INSET_PAD - 4}
              textAnchor="end"
              fontSize={10}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.mute}
            >
              s
            </text>
            <text
              x={INSET_PAD + 4}
              y={INSET_PAD + 10}
              fontSize={10}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.mute}
            >
              P(s)
            </text>

            {/* annotation: show slopes */}
            {ENSEMBLES.map((e, i) => (
              <text
                key={e.name}
                x={INSET_W - INSET_PAD - 6}
                y={INSET_PAD + 18 + i * 14}
                textAnchor="end"
                fontSize={10}
                fontFamily="var(--font-mono), monospace"
                fill={e.color}
              >
                slope = {e.beta}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </figure>
  )
}

function buildPath(
  fn: (s: number) => number,
  range: [number, number],
  xs: (n: number) => number,
  ys: (n: number) => number,
  N: number,
): string {
  const pts: string[] = []
  for (let i = 0; i <= N; i++) {
    const s = range[0] + ((range[1] - range[0]) * i) / N
    const y = Math.min(fn(s), Y_RANGE[1])
    pts.push(`${i === 0 ? 'M' : 'L'} ${xs(s).toFixed(1)},${ys(y).toFixed(1)}`)
  }
  return pts.join(' ')
}

function buildLogPath(
  fn: (s: number) => number,
  range: [number, number],
  xs: (n: number) => number,
  ys: (n: number) => number,
  N: number,
): string {
  const pts: string[] = []
  for (let i = 0; i <= N; i++) {
    // log-spaced sample points
    const t = i / N
    const s =
      range[0] *
      Math.pow(range[1] / range[0], t)
    const y = fn(s)
    if (y < INSET_Y_RANGE[0] || !Number.isFinite(y)) continue
    pts.push(`${pts.length === 0 ? 'M' : 'L'} ${xs(s).toFixed(1)},${ys(y).toFixed(1)}`)
  }
  return pts.join(' ')
}
