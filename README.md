# algebra

A visual essay on linear algebra and the strange order of random matrices.

Two acts: eleven chapters on the geometry of vectors, transformations, and
eigenvectors, then seven on Wigner's gambit, the semicircle law, level
repulsion, and the Riemann bridge. Long-form prose with embedded interactive
widgets, scroll-driven, single page, deployed static to GitHub Pages.

## Status

Phase 0 — scaffolding only. The shell, design system, hash router, and CI
deploy pipeline are in place. No chapter content yet.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173/algebra/
npm run build        # writes dist/
npm run preview      # serves dist/ locally
npm run test         # vitest (currently has no specs)
```

## Stack

- Vite 8 + React 19 + TypeScript 6
- Tailwind 4 (CSS-first config in `src/styles/global.css`)
- `react-router-dom` v7 with `HashRouter` (GitHub Pages compatible)
- D3, Three.js + react-three-fiber, Framer Motion (installed; not yet used)
- mathjs, KaTeX + react-katex
- Vitest, Prettier

## Deploy

CI workflow at `.github/workflows/deploy.yml` builds on push to `main` and
publishes via the official GitHub Pages Actions flow. After the first push:

1. **Settings → Pages → Source = "GitHub Actions"** (not "Deploy from a branch").
2. Confirm the next push to `main` lights up the workflow and ships to
   `https://<your-user>.github.io/algebra/`.

The Vite `base` is hardcoded to `/algebra/`. If the repo is renamed, update
`vite.config.ts` and the favicon `<link>` in `index.html` together.

## Layout

```
src/
├── chapters/            # narrative content, one file per chapter (Phase 1+)
├── components/
│   ├── layout/          # nav, sections, scroll progress
│   ├── ui/              # button, slider, equation
│   └── viz/             # D3 / Canvas / R3F visualization widgets
├── hooks/
├── lib/
│   ├── math/            # matrix.ts, eigen.ts, randomMatrix.ts (vitest)
│   └── viz/             # axes, colors, animation primitives
├── styles/global.css    # Tailwind + design tokens
├── test/setup.ts        # Vitest setup
└── types/
```

## Anti-goals

No backend, auth, comments, analytics, i18n framework, or CMS in v1. The
target is "interactive and clear", not "Manim-grade cinematic".
