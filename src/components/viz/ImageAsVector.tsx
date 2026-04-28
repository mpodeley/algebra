import { useEffect, useMemo, useRef, useState } from 'react'
import { VIZ } from '../../lib/viz/colors'
import { Slider } from '../ui/Slider'

const N = 96 // image side; total dimensionality is N²
const PIXELS = N * N

// ───────────────────────────────────────────────────────────────────
// Procedural source image: a Mona Lisa-flavoured silhouette generated
// from analytic primitives so we don't need to ship raster data.
// ───────────────────────────────────────────────────────────────────

function generateSource(): Float32Array {
  const data = new Float32Array(PIXELS)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const u = (x - N / 2) / (N / 2)
      const v = (y - N / 2) / (N / 2)

      // Warm beige background with soft chiaroscuro from upper-left.
      let g = 0.78 - 0.18 * v - 0.05 * u

      // Hair line cresting over the head
      const hairTop = -0.55 + 0.22 * Math.cos(u * 2.4)
      if (v < hairTop) {
        g = 0.18 + 0.05 * Math.sin(u * 9 + v * 6)
      }

      // Face oval (slightly egg-shaped)
      const inFace =
        (u * u) / 0.45 + ((v + 0.06) * (v + 0.06)) / 0.65 < 1 && v > hairTop
      if (inFace) {
        g = 0.84 + 0.04 * (1 - Math.abs(u))
        if (v < -0.15) g -= 0.06 // forehead shadow
      }

      // Eyes
      for (const eyeU of [-0.2, 0.2]) {
        const ed = Math.hypot((u - eyeU) * 2.1, v + 0.05)
        if (ed < 0.13) {
          g = 0.3 + 0.45 * (ed / 0.13)
        }
      }

      // Faint smile contour
      const md = Math.hypot(u * 2.7, (v - 0.32) * 5)
      if (md < 0.5 && v > 0.22 && v < 0.42) {
        g = 0.55 - 0.08 * Math.cos(u * 6)
      }

      // Bust / shoulders
      if (v > 0.65) {
        g = 0.32 + 0.06 * Math.sin(u * 3.5) - 0.1 * (v - 0.65)
      }

      // Tiny grain
      g += 0.02 * Math.sin(x * 1.7 + y * 2.3)

      data[y * N + x] = Math.max(0, Math.min(1, g))
    }
  }
  return data
}

// ───────────────────────────────────────────────────────────────────
// Filters
// ───────────────────────────────────────────────────────────────────

function lerpArrays(a: Float32Array, b: Float32Array, t: number): Float32Array {
  const out = new Float32Array(a.length)
  for (let i = 0; i < a.length; i++) out[i] = a[i] * (1 - t) + b[i] * t
  return out
}

function clampArr(a: Float32Array): Float32Array {
  const out = new Float32Array(a.length)
  for (let i = 0; i < a.length; i++) {
    out[i] = Math.max(0, Math.min(1, a[i]))
  }
  return out
}

function convolve3(src: Float32Array, kernel: number[], offset = 0): Float32Array {
  const out = new Float32Array(PIXELS)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let sum = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const yy = Math.min(N - 1, Math.max(0, y + ky))
          const xx = Math.min(N - 1, Math.max(0, x + kx))
          sum += src[yy * N + xx] * kernel[(ky + 1) * 3 + (kx + 1)]
        }
      }
      out[y * N + x] = sum + offset
    }
  }
  return out
}

const KERNEL_BLUR = [1 / 16, 2 / 16, 1 / 16, 2 / 16, 4 / 16, 2 / 16, 1 / 16, 2 / 16, 1 / 16]
const KERNEL_SHARPEN = [0, -1, 0, -1, 5, -1, 0, -1, 0]
const KERNEL_EDGE = [-1, -1, -1, -1, 8, -1, -1, -1, -1] // Laplacian

function invertImage(src: Float32Array): Float32Array {
  const out = new Float32Array(PIXELS)
  for (let i = 0; i < PIXELS; i++) out[i] = 1 - src[i]
  return out
}

function fisheye(src: Float32Array, strength: number): Float32Array {
  // Sample inverse: for each output pixel, look up the source pixel via a
  // radial pull. Strength 0 = identity, 1 = strong barrel distortion.
  const out = new Float32Array(PIXELS)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const u = (x - N / 2) / (N / 2)
      const v = (y - N / 2) / (N / 2)
      const r = Math.hypot(u, v)
      const factor = 1 + strength * (1 - r) * 0.6
      const su = u / factor
      const sv = v / factor
      const sx = Math.round(su * (N / 2) + N / 2)
      const sy = Math.round(sv * (N / 2) + N / 2)
      if (sx < 0 || sx >= N || sy < 0 || sy >= N) {
        out[y * N + x] = 0
      } else {
        out[y * N + x] = src[sy * N + sx]
      }
    }
  }
  return out
}

// ───────────────────────────────────────────────────────────────────
// 2D DCT-II for compression. Precomputed cosine table speeds it up.
// ───────────────────────────────────────────────────────────────────

const COS_TABLE = (() => {
  const table = new Float32Array(N * N)
  for (let n = 0; n < N; n++) {
    for (let k = 0; k < N; k++) {
      table[n * N + k] = Math.cos((Math.PI / N) * (n + 0.5) * k)
    }
  }
  return table
})()

const NORM_TABLE = (() => {
  const out = new Float32Array(N)
  out[0] = Math.sqrt(1 / N)
  for (let k = 1; k < N; k++) out[k] = Math.sqrt(2 / N)
  return out
})()

function dct2D(src: Float32Array): Float32Array {
  const tmp = new Float32Array(PIXELS)
  // Row-wise DCT
  for (let y = 0; y < N; y++) {
    for (let k = 0; k < N; k++) {
      let s = 0
      for (let n = 0; n < N; n++) {
        s += src[y * N + n] * COS_TABLE[n * N + k]
      }
      tmp[y * N + k] = s * NORM_TABLE[k]
    }
  }
  const out = new Float32Array(PIXELS)
  // Column-wise DCT
  for (let x = 0; x < N; x++) {
    for (let k = 0; k < N; k++) {
      let s = 0
      for (let n = 0; n < N; n++) {
        s += tmp[n * N + x] * COS_TABLE[n * N + k]
      }
      out[k * N + x] = s * NORM_TABLE[k]
    }
  }
  return out
}

function idct2D(coeffs: Float32Array): Float32Array {
  const tmp = new Float32Array(PIXELS)
  // Inverse column-wise: out[n,x] = Σ_k c[k,x] * norm[k] * cos((π/N)(n+½)k)
  for (let x = 0; x < N; x++) {
    for (let n = 0; n < N; n++) {
      let s = 0
      for (let k = 0; k < N; k++) {
        s += coeffs[k * N + x] * NORM_TABLE[k] * COS_TABLE[n * N + k]
      }
      tmp[n * N + x] = s
    }
  }
  const out = new Float32Array(PIXELS)
  // Inverse row-wise
  for (let y = 0; y < N; y++) {
    for (let n = 0; n < N; n++) {
      let s = 0
      for (let k = 0; k < N; k++) {
        s += tmp[y * N + k] * NORM_TABLE[k] * COS_TABLE[n * N + k]
      }
      out[y * N + n] = s
    }
  }
  return out
}

function buildSortedIndices(dctCoeffs: Float32Array): number[] {
  const indices = new Array<number>(PIXELS)
  for (let i = 0; i < PIXELS; i++) indices[i] = i
  indices.sort((a, b) => Math.abs(dctCoeffs[b]) - Math.abs(dctCoeffs[a]))
  return indices
}

function compressTopK(
  dctCoeffs: Float32Array,
  sortedIndices: number[],
  K: number,
): Float32Array {
  const trimmed = new Float32Array(PIXELS)
  for (let i = 0; i < K; i++) {
    const idx = sortedIndices[i]
    trimmed[idx] = dctCoeffs[idx]
  }
  return idct2D(trimmed)
}

// ───────────────────────────────────────────────────────────────────
// Filter dispatch
// ───────────────────────────────────────────────────────────────────

type FilterId =
  | 'identity'
  | 'blur'
  | 'edge'
  | 'sharpen'
  | 'invert'
  | 'compress'
  | 'fisheye'

const FILTERS: Array<{
  id: FilterId
  label: string
  linear: boolean
  hint: string
}> = [
  { id: 'identity', label: 'identity', linear: true, hint: 'I·v = v.' },
  {
    id: 'blur',
    label: 'Gaussian blur',
    linear: true,
    hint: 'A convolution. Linear: a 9216×9216 sparse matrix in disguise.',
  },
  {
    id: 'edge',
    label: 'edge detect (Laplacian)',
    linear: true,
    hint: 'Another convolution. Same dimensionality, different matrix.',
  },
  {
    id: 'sharpen',
    label: 'sharpen',
    linear: true,
    hint: 'I + (I − blur). Linear combination of linear maps.',
  },
  {
    id: 'invert',
    label: 'invert (negative)',
    linear: true,
    hint: 'v ↦ 1 − v. Linear when written on (intensity − ½).',
  },
  {
    id: 'compress',
    label: 'compress: keep top-K basis components',
    linear: true,
    hint: 'Project onto the K largest DCT coefficients. The whole point of JPEG, of PCA, of the RMT signal-vs-noise split.',
  },
  {
    id: 'fisheye',
    label: 'fish-eye (NON-linear)',
    linear: false,
    hint: 'Pulls pixels radially. Origin moves and parallel lines bend — same failure modes as chapter 03.',
  },
]

// ───────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────

function paintToCanvas(canvas: HTMLCanvasElement | null, data: Float32Array) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const imageData = ctx.createImageData(N, N)
  for (let i = 0; i < PIXELS; i++) {
    const v = Math.max(0, Math.min(1, data[i]))
    const g = Math.round(v * 255)
    imageData.data[i * 4] = g
    imageData.data[i * 4 + 1] = g
    imageData.data[i * 4 + 2] = g
    imageData.data[i * 4 + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

const SOURCE = generateSource()
const SOURCE_DCT = dct2D(SOURCE)
const SORTED_INDICES = buildSortedIndices(SOURCE_DCT)

export function ImageAsVector() {
  const [filterId, setFilterId] = useState<FilterId>('compress')
  const [t, setT] = useState(1)
  const sourceCanvas = useRef<HTMLCanvasElement>(null)
  const resultCanvas = useRef<HTMLCanvasElement>(null)

  const filter = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0]

  const result = useMemo(() => {
    if (filterId === 'identity' || t === 0) return SOURCE
    if (filterId === 'blur') {
      const blurred = clampArr(convolve3(SOURCE, KERNEL_BLUR))
      return lerpArrays(SOURCE, blurred, t)
    }
    if (filterId === 'edge') {
      const edge = clampArr(convolve3(SOURCE, KERNEL_EDGE, 0.5))
      return lerpArrays(SOURCE, edge, t)
    }
    if (filterId === 'sharpen') {
      const sharp = clampArr(convolve3(SOURCE, KERNEL_SHARPEN))
      return lerpArrays(SOURCE, sharp, t)
    }
    if (filterId === 'invert') {
      return lerpArrays(SOURCE, invertImage(SOURCE), t)
    }
    if (filterId === 'compress') {
      const K = Math.max(1, Math.round(t * PIXELS))
      const reconstructed = clampArr(
        compressTopK(SOURCE_DCT, SORTED_INDICES, K),
      )
      return reconstructed
    }
    if (filterId === 'fisheye') {
      return fisheye(SOURCE, t)
    }
    return SOURCE
  }, [filterId, t])

  // Paint source once.
  useEffect(() => {
    paintToCanvas(sourceCanvas.current, SOURCE)
  }, [])

  // Repaint result on every change.
  useEffect(() => {
    paintToCanvas(resultCanvas.current, result)
  }, [result])

  const sliderLabel =
    filterId === 'compress'
      ? `K = ${Math.max(1, Math.round(t * PIXELS))} of ${PIXELS}`
      : `t = ${t.toFixed(2)}`

  return (
    <figure className="my-10 w-full">
      <div className="mx-auto max-w-[480px] space-y-3">
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-mute">
            transformation
          </span>
          <select
            value={filterId}
            onChange={(e) => setFilterId(e.target.value as FilterId)}
            className="block w-full rounded-(--radius-button) border border-line bg-surface px-2.5 py-2 text-[13px] text-ink focus:border-accent focus:outline-none"
          >
            {FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <figure className="space-y-1.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-mute">
              original
            </p>
            <canvas
              ref={sourceCanvas}
              width={N}
              height={N}
              className="block w-full rounded-(--radius-card) border border-line bg-surface"
              style={{ imageRendering: 'pixelated', aspectRatio: '1 / 1' }}
            />
          </figure>
          <figure className="space-y-1.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-mute">
              transformed
            </p>
            <canvas
              ref={resultCanvas}
              width={N}
              height={N}
              className="block w-full rounded-(--radius-card) border border-line bg-surface"
              style={{ imageRendering: 'pixelated', aspectRatio: '1 / 1' }}
            />
          </figure>
        </div>

        <Slider
          label="strength"
          min={0}
          max={1}
          step={filterId === 'compress' ? 0.005 : 0.01}
          value={t}
          onChange={setT}
          display={sliderLabel}
        />

        <div
          className="rounded-(--radius-card) border-l-2 bg-surface px-3 py-2.5"
          style={{ borderColor: filter.linear ? VIZ.teal : VIZ.coral }}
        >
          <p className="font-mono text-[11px] uppercase tracking-wider"
            style={{ color: filter.linear ? VIZ.teal : VIZ.coral }}
          >
            {filter.linear ? 'linear' : 'non-linear'}
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-mute">
            {filter.hint}
          </p>
        </div>
      </div>
    </figure>
  )
}
