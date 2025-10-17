# Simple AI Chat

Deterministic single-page AI chat demo built with Vite, React 19, TypeScript, TailwindCSS, shadcn/ui, Zustand, and Framer Motion. The assistant runs locally with no network calls and adapts its voice, depth, and structure using hardcoded rules.

## Quick start

```bash
yarn
yarn dev
yarn build
yarn preview
yarn test
```

## Features

- Card-based chat surface with animated message reveal, markdown rendering, avatars, timestamps, and accessible auto-scroll.
- Deterministic typing indicator (300–800 ms) and agent replies from a pure `generateAgentReply` function.
- Composer with multiline textarea, Enter-to-send, attachment chips (max 5 files, 10 MB each), inline validation errors, and sticky positioning.
- Options panel controlling **Response Length**, **Model Voice**, **Tone**, and **Focus**—each altering the reply template, cadence, and supplemental notes.
- Light/dark theming with instant toggle, reduced-motion accommodations, and tasteful Framer Motion micro-interactions.
- Unit tests for agent reply routing and attachment validation plus an integration test covering send → typing → reply flow and auto-scroll.

## Options reference

- **Response Length** – Short trims detail, Long expands bullets/steps and adds reminders.
- **Model Voice** – `gpt-mini` terse & direct, `gpt-prose` adds smooth transitions, `gpt-tutor` appends a tailored learning tip.
- **Tone** – Friendly greets/closes warmly, Formal stays precise, Neutral keeps defaults.
- **Focus** – Overview summarises outcomes, Technical adds nuance, Actionable emphasises next steps and structured guidance.

Attachments are acknowledged inline (with type hints) and influence the assistant’s opening context.

## Architecture notes

- `src/lib/agent` encapsulates deterministic reply rules and Markdown generation helpers.
- `src/store` uses tiny Zustand stores: one for chat flow (including simulated typing delay) and one persisted options store.
- `src/components` splits UI primitives (`ui/`), chat surfaces, and theme utilities for clarity.
- `MarkdownContent` uses `react-markdown`, `remark-gfm`, and a sanitised rehype pipeline with syntax highlighting-friendly allowances.
- Tests live in `src/__tests__`, driven by Vitest + React Testing Library.

## Known trade-offs / TODOs

- Reply rules are intentionally opinionated; expanding the DSL would improve maintainability if more styles are needed.
- No persistence for chat history yet—refreshing clears messages (options persist via localStorage).
- Syntax highlighting relies on the default `rehype-highlight` theme; bespoke theming could better match the UI palette.

## Implementation notes

- No network calls or `Math.random`; all behaviour is rule-based and deterministic.
- Tailwind config keeps the palette shadcn-compatible and enables typography + animation utilities.
- Husky + lint-staged run ESLint (strict TypeScript) and Prettier on staged files before commits.
- Prefer composition over prop drilling; business logic stays within `/lib/agent` and the Zustand stores.
