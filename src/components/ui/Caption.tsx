import type { ReactNode } from 'react'

export function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mt-3 max-w-[28rem] text-center text-sm leading-snug text-mute">
      {children}
    </p>
  )
}
