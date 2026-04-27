import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * App-level error boundary. Without it, a crashed widget unmounts the
 * entire chapter route and leaves a blank page. With it, the reader sees
 * a useful message and can navigate elsewhere.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('chapter render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-(--container-prose) px-5 py-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-mute">
            error
          </p>
          <h1 className="mt-3 font-serif text-3xl text-ink">
            Something in this chapter crashed at render time.
          </h1>
          <p className="mt-4 text-mute">
            The console has the stack trace. Open Chapters from the nav and
            try a different one.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-(--radius-card) border border-line bg-surface p-4 font-mono text-[12px] text-ink">
            {this.state.error.message}
          </pre>
        </main>
      )
    }
    return this.props.children
  }
}
