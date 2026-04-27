export type Act = 'la' | 'rmt'
export type ChapterStatus = 'live' | 'soon'

export interface Chapter {
  id: string
  number: string
  title: string
  act: Act
  status: ChapterStatus
}

export const ACT_LABEL: Record<Act, string> = {
  la: 'Linear Algebra',
  rmt: 'Random Matrix Theory',
}

export const chapters: Chapter[] = [
  { id: '01-vectors', number: '01', title: 'Vectors', act: 'la', status: 'live' },
  { id: '02-linear-combinations', number: '02', title: 'Linear combinations, span, basis', act: 'la', status: 'live' },
  { id: '03-linear-transformations', number: '03', title: 'Linear transformations', act: 'la', status: 'live' },
  { id: '04-matrix-multiplication', number: '04', title: 'Matrix multiplication', act: 'la', status: 'live' },
  { id: '05-three-d-transformations', number: '05', title: 'Three-dimensional transformations', act: 'la', status: 'soon' },
  { id: '06-determinant', number: '06', title: 'The determinant', act: 'la', status: 'soon' },
  { id: '07-inverse-rank-null-space', number: '07', title: 'Inverse, rank, null space', act: 'la', status: 'soon' },
  { id: '08-dot-product', number: '08', title: 'Dot product, projections', act: 'la', status: 'soon' },
  { id: '09-change-of-basis', number: '09', title: 'Change of basis', act: 'la', status: 'soon' },
  { id: '10-eigenvectors-eigenvalues', number: '10', title: 'Eigenvectors and eigenvalues', act: 'la', status: 'soon' },
  { id: '11-abstract-vector-spaces', number: '11', title: 'Abstract vector spaces', act: 'la', status: 'soon' },

  { id: 'r01-wigner', number: '12', title: "Wigner's gambit", act: 'rmt', status: 'soon' },
  { id: 'r02-experiment', number: '13', title: 'The experiment', act: 'rmt', status: 'soon' },
  { id: 'r03-semicircle', number: '14', title: 'The semicircle law', act: 'rmt', status: 'soon' },
  { id: 'r04-level-repulsion', number: '15', title: 'Level repulsion', act: 'rmt', status: 'soon' },
  { id: 'r05-three-ensembles', number: '16', title: 'Three ensembles', act: 'rmt', status: 'soon' },
  { id: 'r06-universality', number: '17', title: 'Universality', act: 'rmt', status: 'soon' },
  { id: 'r07-applications', number: '18', title: 'Applications: MIMO, ML, finance', act: 'rmt', status: 'soon' },
  { id: 'r08-riemann', number: '19', title: 'The Riemann bridge', act: 'rmt', status: 'soon' },
]

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}

export function getNextChapter(id: string): Chapter | undefined {
  const idx = chapters.findIndex((c) => c.id === id)
  if (idx === -1) return undefined
  return chapters[idx + 1]
}
