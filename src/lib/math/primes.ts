/**
 * Number-theory helpers for chapter 19.
 *
 * The Chebyshev psi function ψ(x) = Σ_{p^k ≤ x} log p is the natural
 * prime-counting object inside the Riemann explicit formula. It is a
 * step function whose jumps land at every prime power, by an amount
 * equal to log of the underlying prime.
 *
 * The explicit formula reconstructs ψ from a sum over the nontrivial
 * zeros of ζ:
 *     ψ(x) = x − Σ_ρ x^ρ / ρ − log(2π) − ½ log(1 − x^(−2))
 * where the inner sum runs over zeros ρ = ½ + iγ. Truncating to the
 * first N positive γ (and accounting for the conjugate pair via a
 * factor of 2) gives an N-zero approximation that converges to ψ(x)
 * pointwise as N → ∞.
 */

/** Primes up to 200 — enough for ψ(x) at x ≤ 200. */
export const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
  67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
  139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
]

/** Chebyshev ψ(x) = Σ_{p^k ≤ x} log p. Step function. */
export function chebyshevPsi(x: number): number {
  if (x < 2) return 0
  let s = 0
  for (const p of PRIMES) {
    if (p > x) break
    let pk = p
    const lp = Math.log(p)
    while (pk <= x) {
      s += lp
      pk *= p
    }
  }
  return s
}

/**
 * The N-zero approximation of ψ(x) via the explicit formula.
 *
 * `zeros` are positive imaginary parts γ; the conjugate-pair sum is
 * doubled inside. The smooth correction terms (log 2π and the trivial
 * zeros) are included so the approximation matches ψ exactly in the
 * N → ∞ limit.
 */
export function psiFromZeros(x: number, zeros: number[]): number {
  if (x < 1) return 0
  const sqrtX = Math.sqrt(x)
  const logX = Math.log(x)
  let s = 0
  for (const gamma of zeros) {
    const c = Math.cos(gamma * logX)
    const sn = Math.sin(gamma * logX)
    s += (sqrtX * (0.5 * c + gamma * sn)) / (0.25 + gamma * gamma)
  }
  s *= 2 // conjugate pairs
  const trivial = -0.5 * Math.log(Math.max(1 - 1 / (x * x), 1e-12))
  return x - s - Math.log(2 * Math.PI) + trivial
}
