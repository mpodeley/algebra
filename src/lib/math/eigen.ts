/**
 * 2x2 matrix utilities focused on eigenvalues and eigenvectors.
 *
 * Conventions:
 *   M = [[a, b], [c, d]]
 *   Stored as { a, b, c, d } so callers don't need to remember row/column
 *   ordering.
 *   Vectors are { x, y }.
 */

export type Matrix2 = { a: number; b: number; c: number; d: number }
export type Vec2 = { x: number; y: number }

export type EigenResult =
  | {
      kind: 'real-pair'
      lambda1: number
      lambda2: number
      v1: Vec2
      v2: Vec2
    }
  | { kind: 'real-double'; lambda: number; v: Vec2 }
  | { kind: 'complex'; real: number; imag: number }

/** Trace of a 2x2 matrix. */
export function trace(m: Matrix2): number {
  return m.a + m.d
}

/** Determinant of a 2x2 matrix. */
export function det(m: Matrix2): number {
  return m.a * m.d - m.b * m.c
}

/** Multiply matrix by vector. */
export function matVec(m: Matrix2, v: Vec2): Vec2 {
  return { x: m.a * v.x + m.b * v.y, y: m.c * v.x + m.d * v.y }
}

/** Eigenvector for a given (real) eigenvalue. Returns a non-zero direction. */
export function eigenvecFor(m: Matrix2, lambda: number): Vec2 {
  // (M - λI) v = 0
  //   (a-λ) vx + b vy = 0     -> direction (b, λ-a)
  //   c vx + (d-λ) vy = 0     -> direction (λ-d, c)
  const candidates: Vec2[] = [
    { x: m.b, y: lambda - m.a },
    { x: lambda - m.d, y: m.c },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ]
  for (const c of candidates) {
    const norm = Math.hypot(c.x, c.y)
    if (norm > 1e-6) return { x: c.x / norm, y: c.y / norm }
  }
  // Should be unreachable for any non-degenerate matrix.
  return { x: 1, y: 0 }
}

/**
 * Eigen-decomposition of a real 2x2 matrix.
 *
 * For complex pairs (negative discriminant) we return only the real and
 * imaginary parts of one eigenvalue; both eigenvalues are conjugates and
 * there is no real eigenvector.
 */
export function eigen(m: Matrix2, tol = 1e-6): EigenResult {
  const t = trace(m)
  const d = det(m)
  const disc = t * t - 4 * d

  if (disc < -tol) {
    return { kind: 'complex', real: t / 2, imag: Math.sqrt(-disc) / 2 }
  }

  if (Math.abs(disc) < tol) {
    const lambda = t / 2
    return { kind: 'real-double', lambda, v: eigenvecFor(m, lambda) }
  }

  const sqrtDisc = Math.sqrt(disc)
  const lambda1 = (t + sqrtDisc) / 2
  const lambda2 = (t - sqrtDisc) / 2
  return {
    kind: 'real-pair',
    lambda1,
    lambda2,
    v1: eigenvecFor(m, lambda1),
    v2: eigenvecFor(m, lambda2),
  }
}
