/**
 * The imaginary parts of the first ~100 nontrivial zeros of the Riemann
 * zeta function, to five-decimal precision. From Andrew Odlyzko's tables;
 * truncated for embedding so the chunk stays small. Sufficient for a
 * visual demonstration of GUE pair correlation in the spacing
 * distribution.
 */
export const RIEMANN_ZEROS: number[] = [
  14.13472, 21.02204, 25.01086, 30.42488, 32.93506, 37.58618, 40.91872,
  43.32707, 48.00515, 49.77383, 52.97032, 56.44625, 59.34704, 60.83178,
  65.11254, 67.07981, 69.54640, 72.06716, 75.70469, 77.14484, 79.33738,
  82.91038, 84.73549, 87.42528, 88.80911, 92.49190, 94.65134, 95.87063,
  98.83119, 101.31785, 103.72554, 105.44662, 107.16861, 111.02954,
  111.87466, 114.32022, 116.22668, 118.79078, 121.37013, 122.94683,
  124.25682, 127.51668, 129.57870, 131.08769, 133.49774, 134.75651,
  138.11604, 139.73621, 141.12371, 143.11185, 146.00098, 147.42277,
  150.05352, 150.92526, 153.02469, 156.11291, 157.59760, 158.84999,
  161.18896, 163.03071, 165.53707, 167.18444, 169.09452, 169.91198,
  173.41154, 174.75419, 176.44143, 178.37741, 179.91648, 182.20708,
  184.87447, 185.59878, 187.22892, 189.41616, 192.02666, 193.07973,
  195.26540, 196.87648, 198.01531, 201.26475, 202.49359, 204.18967,
  205.39470, 207.90626, 209.57651, 211.69086, 213.34792, 214.54704,
  216.16954, 219.06760, 220.71492, 221.43071, 224.00700, 224.98332,
  227.42144, 229.33741, 231.25019, 231.98724, 233.69340, 236.52423,
]

/**
 * Compute unfolded spacings: each consecutive gap is rescaled by the
 * local mean spacing 2π / log(γ / 2π), so the resulting numbers have
 * mean ~1 and can be compared to the Wigner surmise (β = 2).
 */
export function unfoldedSpacings(zeros: number[]): number[] {
  const out: number[] = []
  for (let i = 0; i < zeros.length - 1; i++) {
    const g = zeros[i]
    const meanSpacing = (2 * Math.PI) / Math.log(g / (2 * Math.PI))
    out.push((zeros[i + 1] - g) / meanSpacing)
  }
  return out
}
