import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'

const SIZE = 480
const PAD = 28
const X_DOMAIN: [number, number] = [-2, 2]
const Y_DOMAIN: [number, number] = [-3, 3]
const X_TICKS = [-1, 1]
const Y_TICKS = [-2, -1, 1, 2]

const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(Y_DOMAIN).range([SIZE - PAD, PAD])

const COEFF_COLORS = [VIZ.blue, VIZ.coral, VIZ.amber, VIZ.purple]
const RESULT_COLOR = VIZ.teal
const N_POINTS = 240

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

function pathFor(fn: (x: number) => number): string {
  const pts: string[] = []
  for (let i = 0; i <= N_POINTS; i++) {
    const x = X_DOMAIN[0] + (X_DOMAIN[1] - X_DOMAIN[0]) * (i / N_POINTS)
    const y = clamp(fn(x), Y_DOMAIN[0] - 2, Y_DOMAIN[1] + 2)
    const px = xScale(x).toFixed(1)
    const py = yScale(y).toFixed(1)
    pts.push(`${i === 0 ? 'M' : 'L'} ${px},${py}`)
  }
  return pts.join(' ')
}

/**
 * A polynomial of degree ≤ 3 is a vector in the four-dimensional space
 * spanned by 1, x, x², x³. Slide the coefficients; the curve is the
 * vector. The faint colored curves underneath are the four basis
 * components a_i · x^i; their sum is the bold teal curve.
 */
export function PolynomialBasis() {
  const [a0, setA0] = useState(0.4)
  const [a1, setA1] = useState(0.8)
  const [a2, setA2] = useState(-0.4)
  const [a3, setA3] = useState(0.2)

  const coeffs = [a0, a1, a2, a3]

  const componentPaths = useMemo(
    () => coeffs.map((c, i) => pathFor((x) => c * Math.pow(x, i))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    coeffs,
  )

  const resultPath = useMemo(
    () =>
      pathFor(
        (x) =>
          a0 + a1 * x + a2 * x * x + a3 * x * x * x,
      ),
    [a0, a1, a2, a3],
  )

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto aspect-square w-full max-w-[480px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-full w-full">
          {/* grid */}
          {X_TICKS.map((t) => (
            <line
              key={`vx${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={yScale(Y_DOMAIN[0])}
              y2={yScale(Y_DOMAIN[1])}
              stroke={VIZ.line}
              strokeWidth={1}
            />
          ))}
          {Y_TICKS.map((t) => (
            <line
              key={`hy${t}`}
              y1={yScale(t)}
              y2={yScale(t)}
              x1={xScale(X_DOMAIN[0])}
              x2={xScale(X_DOMAIN[1])}
              stroke={VIZ.line}
              strokeWidth={1}
            />
          ))}

          {/* axes */}
          <line
            x1={xScale(X_DOMAIN[0])}
            x2={xScale(X_DOMAIN[1])}
            y1={yScale(0)}
            y2={yScale(0)}
            stroke={VIZ.lineStrong}
            strokeWidth={1.25}
          />
          <line
            y1={yScale(Y_DOMAIN[0])}
            y2={yScale(Y_DOMAIN[1])}
            x1={xScale(0)}
            x2={xScale(0)}
            stroke={VIZ.lineStrong}
            strokeWidth={1.25}
          />

          {/* tick labels */}
          {X_TICKS.map((t) => (
            <text
              key={`xtl${t}`}
              x={xScale(t)}
              y={yScale(0) + 18}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.mute}
            >
              {t}
            </text>
          ))}
          {Y_TICKS.map((t) => (
            <text
              key={`ytl${t}`}
              x={xScale(0) - 8}
              y={yScale(t) + 4}
              textAnchor="end"
              fontSize={11}
              fontFamily="var(--font-mono), monospace"
              fill={VIZ.mute}
            >
              {t}
            </text>
          ))}

          {/* component curves */}
          {componentPaths.map((p, i) => (
            <path
              key={`comp${i}`}
              d={p}
              fill="none"
              stroke={COEFF_COLORS[i]}
              strokeWidth={1.5}
              strokeOpacity={0.5}
              strokeDasharray="4 5"
            />
          ))}

          {/* result curve */}
          <path
            d={resultPath}
            fill="none"
            stroke={RESULT_COLOR}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mx-auto mt-4 max-w-[480px] space-y-3">
        <CoeffSlider
          label="a₀ · 1"
          color={COEFF_COLORS[0]}
          value={a0}
          onChange={setA0}
        />
        <CoeffSlider
          label="a₁ · x"
          color={COEFF_COLORS[1]}
          value={a1}
          onChange={setA1}
        />
        <CoeffSlider
          label="a₂ · x²"
          color={COEFF_COLORS[2]}
          value={a2}
          onChange={setA2}
        />
        <CoeffSlider
          label="a₃ · x³"
          color={COEFF_COLORS[3]}
          value={a3}
          onChange={setA3}
        />
        <p className="border-t border-line pt-3 font-mono text-[12px] leading-snug text-mute">
          p(x) ={' '}
          <span style={{ color: RESULT_COLOR }}>
            {a0.toFixed(2)}
            {a1 >= 0 ? ' + ' : ' − '}
            {Math.abs(a1).toFixed(2)} x{a2 >= 0 ? ' + ' : ' − '}
            {Math.abs(a2).toFixed(2)} x²{a3 >= 0 ? ' + ' : ' − '}
            {Math.abs(a3).toFixed(2)} x³
          </span>
        </p>
      </div>
    </figure>
  )
}

function CoeffSlider({
  label,
  color,
  value,
  onChange,
}: {
  label: string
  color: string
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="grid grid-cols-[80px,1fr,60px] items-center gap-3">
      <span style={{ color }} className="font-mono text-[12px]">
        {label}
      </span>
      <div className="relative">
        <Slider
          value={value}
          min={-2}
          max={2}
          step={0.05}
          onChange={onChange}
        />
      </div>
      <span className="font-mono text-[12px] text-ink tabular-nums">
        {value >= 0 ? ' ' : ''}
        {value.toFixed(2)}
      </span>
    </div>
  )
}
