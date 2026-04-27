import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ChapterNav } from './components/layout/ChapterNav'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { Hero } from './chapters/intro/Hero'

const Chapter01 = lazy(() => import('./chapters/linear-algebra/01-vectors'))
const Chapter02 = lazy(
  () => import('./chapters/linear-algebra/02-linear-combinations'),
)
const Chapter03 = lazy(
  () => import('./chapters/linear-algebra/03-linear-transformations'),
)
const Chapter04 = lazy(
  () => import('./chapters/linear-algebra/04-matrix-multiplication'),
)
const Chapter05 = lazy(
  () => import('./chapters/linear-algebra/05-three-d-transformations'),
)
const Chapter06 = lazy(
  () => import('./chapters/linear-algebra/06-determinant'),
)
const Chapter07 = lazy(
  () => import('./chapters/linear-algebra/07-inverse-rank-null-space'),
)
const Chapter08 = lazy(
  () => import('./chapters/linear-algebra/08-dot-product'),
)
const Chapter09 = lazy(
  () => import('./chapters/linear-algebra/09-change-of-basis'),
)
const Chapter10 = lazy(
  () => import('./chapters/linear-algebra/10-eigenvectors-eigenvalues'),
)
const Chapter11 = lazy(
  () => import('./chapters/linear-algebra/11-abstract-vector-spaces'),
)
const ChapterR01 = lazy(() => import('./chapters/rmt/r01-wigner'))
const ChapterR02 = lazy(() => import('./chapters/rmt/r02-experiment'))
const ChapterR03 = lazy(() => import('./chapters/rmt/r03-semicircle'))

function ScrollToTopOnNav() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollProgress />
      <ChapterNav />
      <ScrollToTopOnNav />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/01-vectors" element={<Chapter01 />} />
          <Route
            path="/02-linear-combinations"
            element={<Chapter02 />}
          />
          <Route
            path="/03-linear-transformations"
            element={<Chapter03 />}
          />
          <Route
            path="/04-matrix-multiplication"
            element={<Chapter04 />}
          />
          <Route
            path="/05-three-d-transformations"
            element={<Chapter05 />}
          />
          <Route path="/06-determinant" element={<Chapter06 />} />
          <Route
            path="/07-inverse-rank-null-space"
            element={<Chapter07 />}
          />
          <Route path="/08-dot-product" element={<Chapter08 />} />
          <Route path="/09-change-of-basis" element={<Chapter09 />} />
          <Route
            path="/10-eigenvectors-eigenvalues"
            element={<Chapter10 />}
          />
          <Route
            path="/11-abstract-vector-spaces"
            element={<Chapter11 />}
          />
          <Route path="/r01-wigner" element={<ChapterR01 />} />
          <Route path="/r02-experiment" element={<ChapterR02 />} />
          <Route path="/r03-semicircle" element={<ChapterR03 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

function RouteLoading() {
  return (
    <div className="mx-auto max-w-(--container-prose) px-5 py-32 text-center text-sm text-mute">
      Loading…
    </div>
  )
}

function NotFound() {
  return (
    <main className="mx-auto max-w-(--container-prose) px-5 py-24">
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-mute">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl text-ink">
        That chapter isn&apos;t live yet.
      </h1>
      <p className="mt-4 text-mute">
        Open the Chapters menu to see what&apos;s available.
      </p>
    </main>
  )
}
