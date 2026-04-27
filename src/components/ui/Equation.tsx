import katex from 'katex'
import { useMemo } from 'react'

const OPTS = { throwOnError: false, strict: 'ignore' as const }

export function Eq({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { ...OPTS, displayMode: false }),
    [tex],
  )
  return (
    <span
      className="text-ink"
      // KaTeX returns sanitized HTML.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function EqBlock({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { ...OPTS, displayMode: true }),
    [tex],
  )
  return (
    <div
      className="my-6 overflow-x-auto text-ink"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
