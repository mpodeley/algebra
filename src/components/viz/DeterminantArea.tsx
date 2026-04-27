import { useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { scaleLinear } from 'd3-scale'
import { VIZ } from '../../lib/viz/colors'
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
const DOMAIN: [number, number] = [-3.5, 3.5]
const TICKS = [-3, -2, -1, 1, 2, 3]

const xScale = scaleLinear().domain(DOMAIN).range([PAD, SIZE - PAD])
const yScale = scaleLinear().domain(DOMAIN).range([SIZE - PAD, PAD])

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral

type Which = 'i' | 'j'

/**
 * A pared-down version of GridTransform focused on the unit square. The
 * square is filled solidly so the determinant is visible as both a number
 * and a colored area. When det < 0 the fill switches to coral and a small
 * label notes the orientation flip.
 */
export function DeterminantArea() {
  const [iHat, setIHat] = useState<Vec>({ x: 1.5, y: 0.4 })
  const [jHat, setJHat] = useState<Vec>({ x: -0.4, y: 1.2 })
  const [active, setActive] = useState<Which | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const clipId = useId()

  const det = iHat.x * jHat.y - iHat.y * jHat.x
  const detAbs = Math.abs(det)
  const fillColor = det < 0 ? VIZ.coral : VIZ.teal

  const apply = (p: Vec): Vec => ({
    x: p.x * iHat.x + p.y * jHat.x,
    y: p.x * iHat.y + p.y * jHat.y,
  })

  const unitSquarePts = useMemo(() => {
    const corners = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    return corners
      .map((p) => apply(p))
      .map((p) => `${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`)
      .join(' ')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iHat.x, iHat.y, jHat.x, jHat.y])

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
    if (active === 'i') setIHat(p)
    else setJHat(p)
  }
  function endDrag() {
    setActive(null)
  }
  function reset() {
    setIHat({ x: 1, y: 0 })
    setJHat({ x: 0, y: 1 })
  }

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
            <Arrowhead id="da-i" color={I_COLOR} />
            <Arrowhead id="da-j" color={J_COLOR} />
            <clipPath id={clipId}>
              <rect
                x={PAD}
                y={PAD}
                width={SIZE - 2 * PAD}
                height={SIZE - 2 * PAD}
              />
            </clipPath>
          </defs>

          {/* faint grid */}
          {TICKS.map((t) => (
            <line
              key={`vx${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={yScale(DOMAIN[0])}
              y2={yScale(DOMAIN[1])}
              stroke={VIZ.line}
              strokeWidth={1}
            />
          ))}
          {TICKS.map((t) => (
            <line
              key={`hy${t}`}
              y1={yScale(t)}
              y2={yScale(t)}
              x1={xScale(DOMAIN[0])}
              x2={xScale(DOMAIN[1])}
              stroke={VIZ.line}
              strokeWidth={1}
            />
          ))}

          {/* axes */}
          <line
            x1={xScale(DOMAIN[0])}
            x2={xScale(DOMAIN[1])}
            y1={yScale(0)}
            y2={yScale(0)}
            stroke={VIZ.lineStrong}
            strokeWidth={1.25}
          />
          <line
            y1={yScale(DOMAIN[0])}
            y2={yScale(DOMAIN[1])}
            x1={xScale(0)}
            x2={xScale(0)}
            stroke={VIZ.lineStrong}
            strokeWidth={1.25}
          />

          {/* the deformed unit square — solid fill, color tied to sign */}
          <g clipPath={`url(#${clipId})`}>
            <polygon
              points={unitSquarePts}
              fill={fillColor}
              fillOpacity={0.32}
              stroke={fillColor}
              strokeWidth={2}
            />
          </g>

          {/* basis vectors */}
          <Arrow
            head={iHat}
            color={I_COLOR}
            markerId="da-i"
            xs={xScale}
            ys={yScale}
          />
          <Arrow
            head={jHat}
            color={J_COLOR}
            markerId="da-j"
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

      <div className="mx-auto mt-4 max-w-[480px] space-y-2">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <span className="font-mono text-[12px] text-mute">
            area scale factor
          </span>
          <span
            className="font-serif text-[28px] tabular-nums"
            style={{ color: detAbs < 0.02 ? VIZ.mute : fillColor }}
          >
            {det.toFixed(2)}
          </span>
        </div>
        <p className="font-mono text-[11px] leading-snug text-mute">
          det = (î.x)(ĵ.y) − (î.y)(ĵ.x) = ({iHat.x.toFixed(2)})(
          {jHat.y.toFixed(2)}) − ({iHat.y.toFixed(2)})({jHat.x.toFixed(2)}) ={' '}
          <span style={{ color: fillColor }}>{det.toFixed(3)}</span>
        </p>
        {detAbs < 0.02 ? (
          <p className="text-[12px] text-mute">
            Vectors are parallel — the unit square has collapsed to a line of
            zero area.
          </p>
        ) : det < 0 ? (
          <p className="text-[12px] text-mute">
            Negative determinant: the orientation has been flipped, like
            seeing the plane in a mirror.
          </p>
        ) : null}
        <div className="flex justify-end pt-2">
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
