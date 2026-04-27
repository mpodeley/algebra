import type { ReactNode } from 'react'

export function KeyInsight({
  label = 'Key insight',
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <aside className="my-10 border-l-2 border-accent bg-accent-soft px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        {label}
      </p>
      <div className="mt-2 text-ink [&_p]:m-0 [&_p+p]:mt-3">{children}</div>
    </aside>
  )
}
