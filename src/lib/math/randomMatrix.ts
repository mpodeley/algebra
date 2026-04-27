import { eigs } from 'mathjs'

/**
 * Box-Muller transform: produces one standard Gaussian sample per call.
 * Uses two uniform draws; tolerable inefficiency for our sample sizes.
 */
export function gaussianSample(): number {
  let u1 = Math.random()
  // Avoid log(0).
  while (u1 < 1e-12) u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

/**
 * Generate an N×N matrix from the Gaussian Orthogonal Ensemble.
 *
 * Convention: diagonal entries are N(0, 1) and off-diagonal entries are
 * N(0, 1/2). With this normalization, the eigenvalues of H/√N converge
 * (in distribution) to the Wigner semicircle supported on [−2, 2].
 */
export function generateGOE(N: number): number[][] {
  const M: number[][] = Array.from({ length: N }, () => new Array(N).fill(0))
  const offDiagSigma = Math.SQRT1_2 // sqrt(1/2)
  for (let i = 0; i < N; i++) {
    M[i][i] = gaussianSample()
    for (let j = i + 1; j < N; j++) {
      const v = gaussianSample() * offDiagSigma
      M[i][j] = v
      M[j][i] = v
    }
  }
  return M
}

/**
 * Eigenvalues of a real symmetric matrix. Returns them sorted ascending.
 * Mathjs returns complex objects in general; for symmetric input, the
 * imaginary parts are zero modulo numerics.
 */
export function eigenvaluesOf(M: number[][]): number[] {
  const result = eigs(M, { eigenvectors: false })
  const raw = result.values as Array<number | { re: number; im?: number }>
  const real = raw.map((v) =>
    typeof v === 'number' ? v : v.re,
  )
  real.sort((a, b) => a - b)
  return real
}

/**
 * Convenience wrapper: sample one GOE matrix at size N and return its
 * normalized eigenvalues (each divided by √N) so they live on the
 * semicircle scale [−2, 2].
 */
export function sampleGOEEigenvalues(N: number): number[] {
  const M = generateGOE(N)
  const eig = eigenvaluesOf(M)
  const s = Math.sqrt(N)
  return eig.map((x) => x / s)
}
