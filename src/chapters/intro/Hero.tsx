import { Link } from 'react-router-dom'
import { ACT_LABEL, chapters } from '../../lib/content'

export function Hero() {
  const la = chapters.filter((c) => c.act === 'la')
  const rmt = chapters.filter((c) => c.act === 'rmt')

  return (
    <main className="mx-auto max-w-(--container-prose) px-5 py-20 sm:py-28">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent">
        a visual essay
      </p>

      <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-[56px]">
        Linear algebra,
        <br />
        until it tells you something
        <br />
        about randomness.
      </h1>

      <p className="mt-8 text-lg leading-snug text-mute">
        Two acts. Eleven chapters on the geometry of vectors and
        transformations, then eight on the strange order that emerges when
        the matrix entries are random. The promise: by the end, eigenvalues
        are not a definition you memorized but a thing you can{' '}
        <em>feel</em>.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          to="/01-vectors"
          className="inline-flex items-center gap-2 rounded-(--radius-button) bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Begin with chapter 01
          <span aria-hidden>→</span>
        </Link>
        <span className="text-sm text-mute">drag, scroll, read.</span>
      </div>

      <section className="mt-20 border-t border-line pt-10">
        <Toc title={ACT_LABEL.la} chapters={la} />
        <div className="mt-10">
          <Toc title={ACT_LABEL.rmt} chapters={rmt} />
        </div>
      </section>

      <p className="mt-16 text-sm text-mute">
        Nineteen chapters, eighteen interactive widgets, one continuous
        argument from drag-and-drop arrows in the plane to the spectral
        statistics of the Riemann zeros.
      </p>
    </main>
  )
}

function Toc({
  title,
  chapters: list,
}: {
  title: string
  chapters: typeof chapters
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
        {title}
      </p>
      <ul className="mt-4 space-y-1.5">
        {list.map((c) => {
          const live = c.status === 'live'
          const inner = (
            <span className="flex items-baseline gap-3">
              <span className="w-7 font-mono text-[12px] tabular-nums text-mute">
                {c.number}
              </span>
              <span
                className={
                  live
                    ? 'text-ink underline decoration-line decoration-1 underline-offset-4 group-hover:text-accent group-hover:decoration-accent-line'
                    : 'text-mute'
                }
              >
                {c.title}
              </span>
              {!live && (
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-mute">
                  soon
                </span>
              )}
            </span>
          )
          return (
            <li key={c.id}>
              {live ? (
                <Link to={`/${c.id}`} className="group block py-0.5">
                  {inner}
                </Link>
              ) : (
                <span className="block py-0.5">{inner}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
