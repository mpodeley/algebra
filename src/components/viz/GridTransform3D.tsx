import { useEffect, useMemo, useState } from 'react'
import { VIZ } from '../../lib/viz/colors'
import { EqBlock } from '../ui/Equation'
import { Slider } from '../ui/Slider'

type Vec3 = [number, number, number]
type Mat3 = [Vec3, Vec3, Vec3] // columns: i-hat, j-hat, k-hat

const SIZE = 480
const ORIGIN_X = SIZE / 2
const ORIGIN_Y = SIZE / 2 + 30
const SCALE = 38

const I_COLOR = VIZ.blue
const J_COLOR = VIZ.coral
const K_COLOR = VIZ.teal

const IDENTITY: Mat3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

// Linear transformation = matrix whose columns are images of basis vectors.
const PRESETS: Array<{ id: string; label: string; m: Mat3 }> = [
  { id: 'identity', label: 'identity', m: IDENTITY },
  {
    id: 'rotZ',
    label: 'rotation around Z (90°)',
    m: [
      [0, 1, 0],
      [-1, 0, 0],
      [0, 0, 1],
    ],
  },
  {
    id: 'rotX',
    label: 'rotation around X (90°)',
    m: [
      [1, 0, 0],
      [0, 0, 1],
      [0, -1, 0],
    ],
  },
  {
    id: 'shearXY',
    label: 'shear in XZ-plane',
    m: [
      [1, 0, 0],
      [0, 1, 0],
      [0.8, 0, 1],
    ],
  },
  {
    id: 'scale',
    label: 'scale (1.5, 1, 0.6)',
    m: [
      [1.5, 0, 0],
      [0, 1, 0],
      [0, 0, 0.6],
    ],
  },
  {
    id: 'flipY',
    label: 'flip Y axis',
    m: [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ],
  },
  {
    id: 'collapse',
    label: 'collapse to a plane',
    m: [
      [1, 0, 0],
      [0, 1, 0],
      [0.5, 0.5, 0],
    ],
  },
]

function lerpMat(a: Mat3, b: Mat3, t: number): Mat3 {
  const lerpV = (u: Vec3, v: Vec3): Vec3 => [
    u[0] * (1 - t) + v[0] * t,
    u[1] * (1 - t) + v[1] * t,
    u[2] * (1 - t) + v[2] * t,
  ]
  return [lerpV(a[0], b[0]), lerpV(a[1], b[1]), lerpV(a[2], b[2])]
}

function applyM(m: Mat3, v: Vec3): Vec3 {
  return [
    v[0] * m[0][0] + v[1] * m[1][0] + v[2] * m[2][0],
    v[0] * m[0][1] + v[1] * m[1][1] + v[2] * m[2][1],
    v[0] * m[0][2] + v[1] * m[1][2] + v[2] * m[2][2],
  ]
}

function det3(m: Mat3): number {
  const [i, j, k] = m
  return (
    i[0] * (j[1] * k[2] - j[2] * k[1]) -
    i[1] * (j[0] * k[2] - j[2] * k[0]) +
    i[2] * (j[0] * k[1] - j[1] * k[0])
  )
}

function rotY(theta: number, p: Vec3): Vec3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]]
}
function rotX(theta: number, p: Vec3): Vec3 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]
}

function project(p: Vec3): { x: number; y: number } {
  return {
    x: ORIGIN_X + p[0] * SCALE,
    y: ORIGIN_Y - p[1] * SCALE,
  }
}

const CUBE_VERTICES: Vec3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
]
const CUBE_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

const GRID_RANGE = 2 // grid lines from −2 to 2 along each axis

/**
 * Pick a preset transformation (rotation, shear, scale, collapse), then
 * scrub the morph slider t ∈ [0, 1] to interpolate the basis matrix
 * between identity and the chosen preset. The unit cube + a fragment of
 * the integer grid + the three colored basis arrows all deform together.
 *
 * Camera yaw and pitch rotate the entire post-transformation scene so
 * the warp can be inspected from any side.
 */
export function GridTransform3D() {
  const [presetId, setPresetId] = useState('rotZ')
  const [t, setT] = useState(1)
  const [yaw, setYaw] = useState(0.55)
  const [pitch, setPitch] = useState(0.35)
  const [playing, setPlaying] = useState(false)

  const target = useMemo(
    () => PRESETS.find((p) => p.id === presetId)?.m ?? IDENTITY,
    [presetId],
  )
  const matrix = useMemo(() => lerpMat(IDENTITY, target, t), [t, target])
  const det = det3(matrix)

  // Animation loop for play button
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setT((prev) => {
        const next = prev + dt * 0.6
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  function play() {
    setT(0)
    requestAnimationFrame(() => setPlaying(true))
  }

  // Compose: apply matrix, then camera rotation
  const view = (p: Vec3): Vec3 => rotX(pitch, rotY(yaw, applyM(matrix, p)))

  // Cube edges
  const cubePts = CUBE_VERTICES.map((v) => project(view(v)))
  const cubePaths = CUBE_EDGES.map(([a, b], idx) => ({
    id: `cube-${idx}`,
    x1: cubePts[a].x,
    y1: cubePts[a].y,
    x2: cubePts[b].x,
    y2: cubePts[b].y,
  }))

  // 3D grid: lines parallel to each axis at integer offsets
  const gridLines: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }> = []
  for (let i = -GRID_RANGE; i <= GRID_RANGE; i++) {
    for (let j = -GRID_RANGE; j <= GRID_RANGE; j++) {
      // along X
      const aX = project(view([-GRID_RANGE, i, j]))
      const bX = project(view([GRID_RANGE, i, j]))
      gridLines.push({ id: `gx-${i}-${j}`, x1: aX.x, y1: aX.y, x2: bX.x, y2: bX.y })
      // along Y
      const aY = project(view([i, -GRID_RANGE, j]))
      const bY = project(view([i, GRID_RANGE, j]))
      gridLines.push({ id: `gy-${i}-${j}`, x1: aY.x, y1: aY.y, x2: bY.x, y2: bY.y })
      // along Z
      const aZ = project(view([i, j, -GRID_RANGE]))
      const bZ = project(view([i, j, GRID_RANGE]))
      gridLines.push({ id: `gz-${i}-${j}`, x1: aZ.x, y1: aZ.y, x2: bZ.x, y2: bZ.y })
    }
  }

  // basis arrows
  const origin = project(view([0, 0, 0]))
  const iEnd = project(view([1, 0, 0]))
  const jEnd = project(view([0, 1, 0]))
  const kEnd = project(view([0, 0, 1]))

  const matrixTex = useMemo(() => {
    const fmt = (n: number) => n.toFixed(2)
    return `\\mathbf{M} = \\begin{bmatrix} ${fmt(matrix[0][0])} & ${fmt(matrix[1][0])} & ${fmt(matrix[2][0])} \\\\ ${fmt(matrix[0][1])} & ${fmt(matrix[1][1])} & ${fmt(matrix[2][1])} \\\\ ${fmt(matrix[0][2])} & ${fmt(matrix[1][2])} & ${fmt(matrix[2][2])} \\end{bmatrix}`
  }, [matrix])

  const detColor = Math.abs(det) < 0.02 ? VIZ.mute : det < 0 ? VIZ.coral : VIZ.ink

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-mute">
              transformation
            </span>
            <select
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className="block w-full rounded-(--radius-button) border border-line bg-surface px-2.5 py-2 text-[13px] text-ink focus:border-accent focus:outline-none"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={play}
            disabled={playing}
            className="self-end rounded-(--radius-button) border border-line bg-accent px-3 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {playing ? '…' : 'morph from identity'}
          </button>
        </div>

        <div className="aspect-square w-full">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block h-full w-full"
          >
            <defs>
              <marker
                id="g3-i"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={I_COLOR} />
              </marker>
              <marker
                id="g3-j"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={J_COLOR} />
              </marker>
              <marker
                id="g3-k"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={K_COLOR} />
              </marker>
              <clipPath id="g3-clip">
                <rect x={20} y={20} width={SIZE - 40} height={SIZE - 40} />
              </clipPath>
            </defs>

            <g clipPath="url(#g3-clip)">
              {/* grid */}
              {gridLines.map((l) => (
                <line
                  key={l.id}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={VIZ.line}
                  strokeWidth={1}
                />
              ))}

              {/* cube */}
              {cubePaths.map((l) => (
                <line
                  key={l.id}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={det < 0 ? VIZ.coral : VIZ.lineStrong}
                  strokeOpacity={det < 0 ? 0.7 : 0.7}
                  strokeWidth={1.75}
                />
              ))}
            </g>

            {/* basis arrows */}
            <line
              x1={origin.x}
              y1={origin.y}
              x2={iEnd.x}
              y2={iEnd.y}
              stroke={I_COLOR}
              strokeWidth={2.5}
              strokeLinecap="round"
              markerEnd="url(#g3-i)"
            />
            <line
              x1={origin.x}
              y1={origin.y}
              x2={jEnd.x}
              y2={jEnd.y}
              stroke={J_COLOR}
              strokeWidth={2.5}
              strokeLinecap="round"
              markerEnd="url(#g3-j)"
            />
            <line
              x1={origin.x}
              y1={origin.y}
              x2={kEnd.x}
              y2={kEnd.y}
              stroke={K_COLOR}
              strokeWidth={2.5}
              strokeLinecap="round"
              markerEnd="url(#g3-k)"
            />

            <text
              x={iEnd.x + 8}
              y={iEnd.y + 4}
              fill={I_COLOR}
              fontSize={14}
              fontStyle="italic"
              fontFamily="var(--font-serif), serif"
            >
              î
            </text>
            <text
              x={jEnd.x + 4}
              y={jEnd.y - 8}
              fill={J_COLOR}
              fontSize={14}
              fontStyle="italic"
              fontFamily="var(--font-serif), serif"
            >
              ĵ
            </text>
            <text
              x={kEnd.x + 8}
              y={kEnd.y - 4}
              fill={K_COLOR}
              fontSize={14}
              fontStyle="italic"
              fontFamily="var(--font-serif), serif"
            >
              k̂
            </text>
          </svg>
        </div>

        <Slider
          label="t (morph from identity)"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(next) => {
            setPlaying(false)
            setT(next)
          }}
          display={t < 0.02 ? 'identity' : t > 0.98 ? presetId : 'morphing…'}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Slider
            label="camera yaw"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={yaw}
            onChange={setYaw}
            display={`${((yaw * 180) / Math.PI).toFixed(0)}°`}
          />
          <Slider
            label="camera pitch"
            min={-Math.PI / 2}
            max={Math.PI / 2}
            step={0.01}
            value={pitch}
            onChange={setPitch}
            display={`${((pitch * 180) / Math.PI).toFixed(0)}°`}
          />
        </div>

        <div className="rounded-(--radius-card) border border-line bg-surface px-4 py-3">
          <EqBlock tex={matrixTex} />
          <p className="border-t border-line pt-3 font-mono text-[12px] text-mute">
            det(M) ={' '}
            <span style={{ color: detColor }}>{det.toFixed(3)}</span>
            {Math.abs(det) < 0.02 && ' — collapsed to a plane or lower'}
            {det < 0 && Math.abs(det) >= 0.02 && ' — orientation flipped'}
          </p>
        </div>
      </div>
    </figure>
  )
}
