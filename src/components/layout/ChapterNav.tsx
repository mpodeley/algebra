import { Link, useLocation } from 'react-router-dom'

const SECTIONS = [
  { to: '/', label: 'Intro' },
  { to: '/intro', label: 'Linear Algebra' },
] as const

export function ChapterNav() {
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-(--container-wide) items-center justify-between px-5">
        <Link
          to="/"
          className="font-mono text-[13px] tracking-tight text-ink hover:text-accent"
        >
          algebra
          <span className="text-mute"> · linear → random</span>
        </Link>

        <ul className="flex items-center gap-5 text-[13px]">
          {SECTIONS.map(({ to, label }) => {
            const active = pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={
                    active
                      ? 'text-accent'
                      : 'text-mute hover:text-ink transition-colors'
                  }
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
