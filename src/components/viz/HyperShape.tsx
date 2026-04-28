import { useEffect, useMemo, useRef, useState } from 'react'
import { Slider } from '../ui/Slider'

type Vec4 = [number, number, number, number]
type Vec3 = [number, number, number]

const SIZE = 480
const ORIGIN_X = SIZE / 2
const ORIGIN_Y = SIZE / 2 + 20
const SCREEN_SCALE = 70

const TET_FACTOR = 1 / Math.sqrt(3)

// ───────────────────────────────────────────────────────────────────
// 4D shape catalogue
// ───────────────────────────────────────────────────────────────────

function buildTesseract() {
  const vertices: Vec4[] = []
  for (let i = 0; i < 16; i++) {
    vertices.push([
      i & 1 ? 1 : -1,
      i & 2 ? 1 : -1,
      i & 4 ? 1 : -1,
      i & 8 ? 1 : -1,
    ])
  }
  const edges: Array<[number, number]> = []
  for (let a = 0; a < 16; a++) {
    for (let b = a + 1; b < 16; b++) {
      const x = a ^ b
      if (x === 1 || x === 2 || x === 4 || x === 8) edges.push([a, b])
    }
  }
  return { vertices, edges }
}

function buildSixteenCell() {
  const vertices: Vec4[] = [
    [1.4, 0, 0, 0],
    [-1.4, 0, 0, 0],
    [0, 1.4, 0, 0],
    [0, -1.4, 0, 0],
    [0, 0, 1.4, 0],
    [0, 0, -1.4, 0],
    [0, 0, 0, 1.4],
    [0, 0, 0, -1.4],
  ]
  const edges: Array<[number, number]> = []
  for (let a = 0; a < 8; a++) {
    for (let b = a + 1; b < 8; b++) {
      // skip antipodal pairs (same axis, opposite signs)
      if (Math.floor(a / 2) !== Math.floor(b / 2)) edges.push([a, b])
    }
  }
  return { vertices, edges }
}

function buildFiveCell() {
  const sqrt5 = Math.sqrt(5)
  // 4 vertices of a 3D tetrahedron at w = 0, plus a 5th lifted along w
  const verts: Vec4[] = [
    [1, 1, 1, 0],
    [1, -1, -1, 0],
    [-1, 1, -1, 0],
    [-1, -1, 1, 0],
    [0, 0, 0, sqrt5],
  ]
  // Center the centroid at the origin
  const cw = sqrt5 / 5
  const vertices: Vec4[] = verts.map(
    (v) => [v[0], v[1], v[2], v[3] - cw] as Vec4,
  )
  const edges: Array<[number, number]> = []
  for (let a = 0; a < 5; a++) {
    for (let b = a + 1; b < 5; b++) edges.push([a, b])
  }
  return { vertices, edges }
}

const SHAPES = {
  tesseract: {
    ...buildTesseract(),
    label: 'tesseract — 4-cube · 16 vertices · 32 edges',
  },
  sixteen: {
    ...buildSixteenCell(),
    label: '16-cell — cross-polytope · 8 vertices · 24 edges',
  },
  five: {
    ...buildFiveCell(),
    label: '5-cell — 4-simplex · 5 vertices · 10 edges',
  },
} as const

type ShapeId = keyof typeof SHAPES

// ───────────────────────────────────────────────────────────────────
// Math
// ───────────────────────────────────────────────────────────────────

function rotPlane(theta: number, p: Vec4, i: number, j: number): Vec4 {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const r = [p[0], p[1], p[2], p[3]] as Vec4
  r[i] = c * p[i] - s * p[j]
  r[j] = s * p[i] + c * p[j]
  return r
}

/**
 * Tetrahedral projection from 4D to 3D. The columns of this 3×4 matrix
 * are four 3D vectors pointing to the corners of a regular tetrahedron;
 * each 4D coordinate is the weight applied to one of the four vectors,
 * and the kernel of the projection is the (1, 1, 1, 1) direction (the
 * four vectors sum to zero).
 */
function projectTet(p: Vec4): Vec3 {
  return [
    TET_FACTOR * (p[0] + p[1] - p[2] - p[3]),
    TET_FACTOR * (p[0] - p[1] + p[2] - p[3]),
    TET_FACTOR * (p[0] - p[1] - p[2] + p[3]),
  ]
}

function rotY3(t: number, p: Vec3): Vec3 {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]]
}
function rotX3(t: number, p: Vec3): Vec3 {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]
}

function project2D(p: Vec3): { x: number; y: number } {
  return {
    x: ORIGIN_X + p[0] * SCREEN_SCALE,
    y: ORIGIN_Y - p[1] * SCREEN_SCALE,
  }
}

// Lerp from blue (negative w) through neutral (w = 0) to coral (positive w).
function depthColor(w: number): string {
  const t = Math.max(-1, Math.min(1, w / 1.4))
  if (t >= 0) {
    // teal → coral
    const r = Math.round(29 + (216 - 29) * t)
    const g = Math.round(158 + (90 - 158) * t)
    const b = Math.round(117 + (48 - 117) * t)
    return `rgb(${r},${g},${b})`
  } else {
    const u = -t
    const r = Math.round(29 + (55 - 29) * u)
    const g = Math.round(158 + (138 - 158) * u)
    const b = Math.round(117 + (221 - 117) * u)
    return `rgb(${r},${g},${b})`
  }
}

// ───────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────

export function HyperShape() {
  const [shapeId, setShapeId] = useState<ShapeId>('tesseract')
  const [xw, setXw] = useState(0.5)
  const [yw, setYw] = useState(0.2)
  const [zw, setZw] = useState(0)
  const [yaw, setYaw] = useState(0.55)
  const [pitch, setPitch] = useState(0.3)
  const [playing, setPlaying] = useState(false)

  const shape = SHAPES[shapeId]
  const playRef = useRef(playing)
  playRef.current = playing

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setXw((p) => p + dt * 0.45)
      setYw((p) => p + dt * 0.31)
      setZw((p) => p + dt * 0.19)
      if (playRef.current) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const projectedVertices = useMemo(() => {
    return shape.vertices.map((v) => {
      const r1 = rotPlane(xw, v, 0, 3)
      const r2 = rotPlane(yw, r1, 1, 3)
      const r3 = rotPlane(zw, r2, 2, 3)
      const p3 = projectTet(r3)
      const cam = rotX3(pitch, rotY3(yaw, p3))
      const screen = project2D(cam)
      return { x: screen.x, y: screen.y, z: cam[2], w: r3[3] }
    })
  }, [shape, xw, yw, zw, yaw, pitch])

  // Sort edges back-to-front so closer edges are drawn over farther ones.
  const sortedEdges = useMemo(() => {
    return shape.edges
      .map(([a, b]) => {
        const va = projectedVertices[a]
        const vb = projectedVertices[b]
        return {
          va,
          vb,
          avgZ: (va.z + vb.z) / 2,
          avgW: (va.w + vb.w) / 2,
        }
      })
      .sort((a, b) => a.avgZ - b.avgZ)
  }, [projectedVertices, shape.edges])

  function reset() {
    setXw(0.5)
    setYw(0.2)
    setZw(0)
  }

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
        <div className="grid grid-cols-[1fr,auto] gap-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-mute">
              4D shape
            </span>
            <select
              value={shapeId}
              onChange={(e) => setShapeId(e.target.value as ShapeId)}
              className="block w-full rounded-(--radius-button) border border-line bg-surface px-2.5 py-2 text-[13px] text-ink focus:border-accent focus:outline-none"
            >
              {(Object.keys(SHAPES) as ShapeId[]).map((id) => (
                <option key={id} value={id}>
                  {SHAPES[id].label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="self-end rounded-(--radius-button) border border-line bg-accent px-3 py-2 text-[12px] font-medium text-white transition-opacity hover:opacity-90"
          >
            {playing ? 'pause' : 'animate 4D'}
          </button>
        </div>

        <div className="aspect-square w-full">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block h-full w-full"
          >
            <defs>
              <clipPath id="hs-clip">
                <rect x={20} y={20} width={SIZE - 40} height={SIZE - 40} />
              </clipPath>
            </defs>

            <g clipPath="url(#hs-clip)">
              {sortedEdges.map((e, idx) => (
                <line
                  key={idx}
                  x1={e.va.x}
                  y1={e.va.y}
                  x2={e.vb.x}
                  y2={e.vb.y}
                  stroke={depthColor(e.avgW)}
                  strokeWidth={1.75}
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                />
              ))}
              {/* vertices on top */}
              {projectedVertices.map((v, idx) => (
                <circle
                  key={idx}
                  cx={v.x}
                  cy={v.y}
                  r={2.5}
                  fill={depthColor(v.w)}
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-(--radius-card) border border-line bg-surface px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-mute">
              4D rotation (rotates the body before projecting)
            </p>
            <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-2">
              <Slider
                label="x⇄w"
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={((xw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)}
                onChange={(n) => {
                  setPlaying(false)
                  setXw(n)
                }}
                display={`${((xw * 180) / Math.PI).toFixed(0)}°`}
              />
              <Slider
                label="y⇄w"
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={((yw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)}
                onChange={(n) => {
                  setPlaying(false)
                  setYw(n)
                }}
                display={`${((yw * 180) / Math.PI).toFixed(0)}°`}
              />
              <Slider
                label="z⇄w"
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={((zw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)}
                onChange={(n) => {
                  setPlaying(false)
                  setZw(n)
                }}
                display={`${((zw * 180) / Math.PI).toFixed(0)}°`}
              />
            </div>
          </div>

          <div className="rounded-(--radius-card) border border-line bg-surface px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-mute">
              3D camera (after projection)
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
              <Slider
                label="yaw"
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                value={yaw}
                onChange={setYaw}
                display={`${((yaw * 180) / Math.PI).toFixed(0)}°`}
              />
              <Slider
                label="pitch"
                min={-Math.PI / 2}
                max={Math.PI / 2}
                step={0.01}
                value={pitch}
                onChange={setPitch}
                display={`${((pitch * 180) / Math.PI).toFixed(0)}°`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] text-mute">
              edge color tracks the rotated{' '}
              <span style={{ color: depthColor(-1.2) }}>w &lt; 0</span>{' '}
              ↔{' '}
              <span style={{ color: depthColor(0) }}>w = 0</span>{' '}
              ↔{' '}
              <span style={{ color: depthColor(1.2) }}>w &gt; 0</span>
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
