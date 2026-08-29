# QuizDing

A little trivia quiz app built with React and Vite. Pick a difficulty, answer 5 random questions pulled from the [Open Trivia Database](https://opentdb.com/), and see how you did at the end (confetti included if you do well).

This started life as a Scrimba React exercise and grew from there.

## Running it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Other commands

- `npm run build` — bundles everything up for production
- `npm run preview` — serves that production build locally so you can sanity-check it
- `npm run lint` — runs Oxlint over the codebase

## How it's put together

Nothing fancy — plain React with hooks, no router, no state management library. The app is basically a tiny state machine that flips between a title screen and a quiz screen:

- `TitleScreen` — pick your difficulty (Any, Easy, Medium, Hard) and hit start
- `QuizScreen` — fetches questions from OTDB and walks you through them one at a time
- `SummaryScreen` — shows your score once you're done

Worth knowing: OTDB rate-limits to one request every 5 seconds per IP, so don't be surprised if rapid-fire retries get throttled.

## Tech

- React 19 + Vite
- Plain CSS (with a light/dark theme toggle)
- Oxlint for linting
- No test runner set up yet
