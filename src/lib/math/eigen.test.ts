import { describe, expect, it } from 'vitest'
import { eigen, eigenvecFor, det, trace, matVec } from './eigen'

const closeTo = (a: number, b: number, tol = 1e-5) => Math.abs(a - b) < tol

describe('trace and det', () => {
  it('reads identity', () => {
    expect(trace({ a: 1, b: 0, c: 0, d: 1 })).toBe(2)
    expect(det({ a: 1, b: 0, c: 0, d: 1 })).toBe(1)
  })

  it('reads a generic 2x2', () => {
    expect(trace({ a: 2, b: -1, c: 4, d: 5 })).toBe(7)
    expect(det({ a: 2, b: -1, c: 4, d: 5 })).toBe(2 * 5 - -1 * 4)
  })
})

describe('eigen', () => {
  it('finds eigenvalues 2, 3 of diag(2, 3)', () => {
    const r = eigen({ a: 2, b: 0, c: 0, d: 3 })
    expect(r.kind).toBe('real-pair')
    if (r.kind === 'real-pair') {
      const sorted = [r.lambda1, r.lambda2].sort()
      expect(sorted).toEqual([2, 3])
    }
  })

  it('returns complex eigenvalues for a 90° rotation', () => {
    const r = eigen({ a: 0, b: -1, c: 1, d: 0 })
    expect(r.kind).toBe('complex')
    if (r.kind === 'complex') {
      expect(closeTo(r.real, 0)).toBe(true)
      expect(closeTo(r.imag, 1)).toBe(true)
    }
  })

  it('returns a real double eigenvalue for the shear [[1,1],[0,1]]', () => {
    const r = eigen({ a: 1, b: 1, c: 0, d: 1 })
    expect(r.kind).toBe('real-double')
    if (r.kind === 'real-double') {
      expect(closeTo(r.lambda, 1)).toBe(true)
      // Eigenvector is along (1, 0)
      expect(Math.abs(r.v.y)).toBeLessThan(1e-5)
    }
  })

  it('returns 0 as an eigenvalue when the matrix is singular', () => {
    const r = eigen({ a: 1, b: 1, c: 2, d: 2 }) // rank 1
    expect(r.kind).toBe('real-pair')
    if (r.kind === 'real-pair') {
      const sorted = [r.lambda1, r.lambda2].sort()
      expect(closeTo(sorted[0], 0)).toBe(true)
      expect(closeTo(sorted[1], 3)).toBe(true)
    }
  })

  it('eigenvectors actually do not rotate', () => {
    // An asymmetric matrix with two real eigenvalues
    const M = { a: 4, b: 1, c: 2, d: 3 }
    const r = eigen(M)
    if (r.kind === 'real-pair') {
      const Mv1 = matVec(M, r.v1)
      // M v1 should be parallel to v1 (cross product near zero)
      const cross1 = Mv1.x * r.v1.y - Mv1.y * r.v1.x
      expect(closeTo(cross1, 0, 1e-4)).toBe(true)

      const Mv2 = matVec(M, r.v2)
      const cross2 = Mv2.x * r.v2.y - Mv2.y * r.v2.x
      expect(closeTo(cross2, 0, 1e-4)).toBe(true)
    } else {
      throw new Error('expected real-pair')
    }
  })
})

describe('eigenvecFor', () => {
  it('returns a unit vector', () => {
    const v = eigenvecFor({ a: 4, b: 1, c: 2, d: 3 }, 5)
    const norm = Math.hypot(v.x, v.y)
    expect(closeTo(norm, 1)).toBe(true)
  })
})
