# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a Scrimba "React Quiz" exercise, currently at the unmodified Vite + React starter template stage (`src/App.jsx` still contains the default Vite counter demo, not quiz logic). Expect to build the actual quiz app from here.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint

There is no test runner configured in this project.

## Architecture

- Plain JavaScript (JSX, not TypeScript) React 19 app scaffolded by `create-vite`.
- Entry point: `src/main.jsx` mounts `<App />` from `src/App.jsx` into `#root`, wrapped in `StrictMode`.
- Single-file component structure so far — no router, no state management library, no component directory structure established yet.
- Static assets referenced via `import` (from `src/assets/`) for bundled images, or via absolute `/path` URLs (e.g. `/icons.svg`, `/favicon.svg`) for files in `public/` served as-is.
- Linting is via Oxlint (not ESLint), configured in `.oxlintrc.json` with the `react` and `oxc` plugin rule sets. Notable enabled rules: `react/rules-of-hooks` (error), `react/only-export-components` (warn).

# Project Guidelines

- Tech Stack: React (JSX, Vite, Plain CSS or Tailwind)
- Core React Hooks: useState, useEffect, useRef
- API: Open Trivia DB (OTDB)
- Focus: Simple educational code over complex third-party state libraries.
