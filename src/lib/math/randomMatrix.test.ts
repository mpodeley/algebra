import { describe, expect, it } from 'vitest'
import { generateGOE, gaussianSample, eigenvaluesOf } from './randomMatrix'

describe('gaussianSample', () => {
  it('mean ≈ 0, variance ≈ 1 for N samples', () => {
    const N = 10000
    let sum = 0
    let sumSq = 0
    for (let i = 0; i < N; i++) {
      const x = gaussianSample()
      sum += x
      sumSq += x * x
    }
    const mean = sum / N
    const variance = sumSq / N - mean * mean
    expect(Math.abs(mean)).toBeLessThan(0.05)
    expect(Math.abs(variance - 1)).toBeLessThan(0.05)
  })
})

describe('generateGOE', () => {
  it('is symmetric', () => {
    const N = 30
    const M = generateGOE(N)
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        expect(M[i][j]).toBe(M[j][i])
      }
    }
  })

  it('off-diagonal entries have variance ≈ 1/2', () => {
    const N = 60
    const M = generateGOE(N)
    let sumSq = 0
    let count = 0
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        sumSq += M[i][j] * M[i][j]
        count++
      }
    }
    const variance = sumSq / count
    expect(Math.abs(variance - 0.5)).toBeLessThan(0.08)
  })

  it('diagonal entries have variance ≈ 1', () => {
    const N = 200
    const M = generateGOE(N)
    let sumSq = 0
    for (let i = 0; i < N; i++) sumSq += M[i][i] * M[i][i]
    const variance = sumSq / N
    expect(Math.abs(variance - 1)).toBeLessThan(0.2)
  })
})

describe('eigenvaluesOf', () => {
  it('matches a hand-computed 2x2 case', () => {
    const M = [
      [2, 0],
      [0, 5],
    ]
    const eig = eigenvaluesOf(M)
    expect(eig.length).toBe(2)
    expect(Math.abs(eig[0] - 2)).toBeLessThan(1e-6)
    expect(Math.abs(eig[1] - 5)).toBeLessThan(1e-6)
  })

  it('returns N real eigenvalues for symmetric NxN', () => {
    const M = generateGOE(15)
    const eig = eigenvaluesOf(M)
    expect(eig.length).toBe(15)
    // sorted ascending
    for (let i = 1; i < eig.length; i++) {
      expect(eig[i]).toBeGreaterThanOrEqual(eig[i - 1])
    }
  })
})
