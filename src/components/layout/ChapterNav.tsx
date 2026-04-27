import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ACT_LABEL, chapters, getChapter } from '../../lib/content'

export function ChapterNav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on route change.
  useEffect(() => setOpen(false), [pathname])

  // Close on outside click / escape.
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const currentId = pathname.replace(/^\//, '')
  const current = currentId ? getChapter(currentId) : undefined
  const live = chapters.filter((c) => c.status === 'live')

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-(--container-wide) items-center justify-between gap-4 px-5">
        <Link
          to="/"
          className="font-mono text-[13px] tracking-tight text-ink hover:text-accent"
        >
          algebra
          <span className="text-mute"> · linear → random</span>
        </Link>

        {current && (
          <span className="hidden truncate text-[13px] text-mute sm:inline">
            ch {current.number} · {current.title}
          </span>
        )}

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-(--radius-button) px-2.5 py-1.5 text-[13px] text-mute transition-colors hover:text-ink"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            Chapters
            <span aria-hidden className="text-[10px]">
              {open ? '▴' : '▾'}
            </span>
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-[min(82vw,360px)] origin-top-right overflow-hidden rounded-(--radius-card) border border-line bg-surface shadow-[0_8px_24px_rgba(15,15,16,0.08)]"
            >
              <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {ACT_LABEL.la}
              </p>
              <ul className="pb-1">
                {chapters
                  .filter((c) => c.act === 'la')
                  .map((c) => (
                    <ChapterRow
                      key={c.id}
                      chapter={c}
                      active={c.id === currentId}
                    />
                  ))}
              </ul>
              <p className="border-t border-line px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                {ACT_LABEL.rmt}
              </p>
              <ul className="pb-2">
                {chapters
                  .filter((c) => c.act === 'rmt')
                  .map((c) => (
                    <ChapterRow
                      key={c.id}
                      chapter={c}
                      active={c.id === currentId}
                    />
                  ))}
              </ul>
              {live.length === 1 && (
                <p className="border-t border-line px-4 py-2 text-[11px] text-mute">
                  Phase 1: only chapter 01 is live. The rest will land
                  iteratively.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function ChapterRow({
  chapter,
  active,
}: {
  chapter: (typeof chapters)[number]
  active: boolean
}) {
  const isLive = chapter.status === 'live'
  const cls = active
    ? 'bg-accent-soft text-accent'
    : isLive
      ? 'text-ink hover:bg-accent-soft hover:text-accent'
      : 'text-mute cursor-not-allowed'

  const inner = (
    <span className="flex items-baseline gap-3">
      <span className="font-mono text-[11px] tabular-nums text-mute">
        {chapter.number}
      </span>
      <span className="flex-1 text-[13px] leading-tight">
        {chapter.title}
      </span>
      {!isLive && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
          soon
        </span>
      )}
    </span>
  )

  if (!isLive) {
    return (
      <li>
        <span className={`block px-4 py-2 ${cls}`}>{inner}</span>
      </li>
    )
  }

  return (
    <li>
      <Link to={`/${chapter.id}`} className={`block px-4 py-2 ${cls}`}>
        {inner}
      </Link>
    </li>
  )
}
