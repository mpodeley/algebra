// Semantic palette tokens for visualizations.
// The hex values here are the source of truth — they must mirror @theme in
// styles/global.css. Plain hex (not CSS vars) so D3 / Canvas / SVG can read
// them without DOM lookups.

export const VIZ = {
  blue: '#378ADD',
  teal: '#1D9E75',
  coral: '#D85A30',
  amber: '#BA7517',
  purple: '#7F77DD',

  ink: '#1A1A1C',
  mute: '#6E6E70',
  line: 'rgba(26, 26, 28, 0.08)',
  lineStrong: 'rgba(26, 26, 28, 0.18)',
  bg: '#FAFAF7',
  surface: '#FFFFFF',
} as const

export const VECTOR_COLORS = {
  v: VIZ.blue,
  w: VIZ.coral,
  sum: VIZ.teal,
} as const
