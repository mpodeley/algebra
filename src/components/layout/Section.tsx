import type { ReactNode } from 'react'

type Width = 'prose' | 'wide' | 'full'

const widthClass: Record<Width, string> = {
  prose: 'max-w-(--container-prose)',
  wide: 'max-w-(--container-wide)',
  full: 'max-w-none',
}

export function Section({
  children,
  width = 'prose',
  className = '',
}: {
  children: ReactNode
  width?: Width
  className?: string
}) {
  return (
    <section className={`mx-auto px-5 ${widthClass[width]} ${className}`}>
      {children}
    </section>
  )
}
