import { Link } from 'react-router-dom'
import { Section } from './Section'

export function ChapterFooter({
  next,
}: {
  next?: { id: string; number: string; title: string; available: boolean }
}) {
  return (
    <footer className="mt-24 border-t border-line">
      <Section width="prose" className="py-12">
        {next ? (
          next.available ? (
            <Link
              to={`/${next.id}`}
              className="group block transition-colors"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                Next · Chapter {next.number}
              </p>
              <p className="mt-2 font-serif text-2xl text-ink group-hover:text-accent">
                {next.title}{' '}
                <span aria-hidden className="ml-1">
                  →
                </span>
              </p>
            </Link>
          ) : (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                Next · Chapter {next.number}
              </p>
              <p className="mt-2 font-serif text-2xl text-mute">
                {next.title}{' '}
                <span className="text-sm font-sans not-italic">
                  (coming soon)
                </span>
              </p>
            </div>
          )
        ) : (
          <Link to="/" className="text-sm text-mute hover:text-accent">
            ← back to start
          </Link>
        )}
      </Section>
    </footer>
  )
}
