import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <main className="mx-auto max-w-(--container-prose) px-5 py-24 sm:py-32">
      <p className="font-mono text-[13px] tracking-wide text-accent">
        a visual essay
      </p>

      <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
        Linear algebra,
        <br />
        until it tells you something
        <br />
        about randomness.
      </h1>

      <p className="mt-8 text-lg text-mute">
        Two acts. Eleven chapters on the geometry of vectors and
        transformations, then seven on the strange order that emerges when the
        matrix entries are random. The promise: by the end, eigenvalues are not
        a definition you memorized but a thing you can <em>feel</em>.
      </p>

      <div className="mt-12 flex items-center gap-4">
        <Link
          to="/intro"
          className="inline-flex items-center gap-2 rounded-(--radius-button) bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Begin
          <span aria-hidden>→</span>
        </Link>
        <span className="text-sm text-mute">~90 minutes, scroll to read</span>
      </div>

      <div className="mt-24 border-t border-line pt-8 text-sm text-mute">
        <p>
          Status: scaffolding. Phase 0 ships the shell and deploy pipeline; the
          chapters land in subsequent phases.
        </p>
      </div>
    </main>
  )
}
