# Simple AI Chat

Minimalist, deterministic AI chat experience built with Vite, React 19, TypeScript, TailwindCSS, shadcn/ui, Zustand, and Framer Motion. The assistant runs locally with no network calls and adapts its voice, depth, and structure using deterministic rules.

## Quick start

### Prerequisites

- Node.js 18+ (development uses v22.19.0)
- Yarn 1 (development uses v1.22.22). `npm` or `pnpm` will also work, but the commands below assume Yarn.

### Set up the project

```bash
git clone https://github.com/davidlucas2012/chat.git
cd chat
yarn install
```

- `git clone …` downloads the latest sources from GitHub.
- `cd chat` moves into the project so subsequent commands execute against the workspace.
- `yarn install` resolves and downloads the exact dependency versions captured in `yarn.lock`.

### Run the development server

```bash
yarn dev
```

- Vite boots a hot-reloading dev server (default: `http://localhost:5173`). Open the URL in your browser to see the chat UI update as you edit files in `src/`.

### Validate and build

```bash
yarn lint       # static analysis via ESLint (strict TypeScript config)
yarn typecheck  # project-wide type checks without emitting code
yarn test       # Vitest + Testing Library suite
yarn build      # type-check, then generate the production bundle in /dist
yarn preview    # serve the production build locally for smoke testing
```

- Run `yarn lint` and `yarn typecheck` before committing to catch issues early.
- `yarn build` chains `tsc -b` with `vite build`, producing an optimized bundle.
- `yarn preview` hosts the generated assets with the same configuration Vite uses in production, making it ideal for quick regression checks.
- `yarn test` executes behaviour-level checks covering reply routing, attachment validation, and the chat flow.

## Features

- Centered chat canvas with soft-edged shells, custom light/dark palettes, animated message reveals, and auto-scroll that respects reduced motion.
- Assistant/user bubbles styled to match the reference mock: avatars, timestamps, Markdown (lists, inline/blocked code), and attachment chips.
- Sticky composer with multiline textarea, Enter-to-send, Shift+Enter for line breaks, paperclip uploads (max 5 files, 10 MB), inline validation, and deterministic typing indicator.
- Inline options row (desktop) / popover (mobile) that controls **Response length**, **Model**, and **Tone**; each option feeds the reply generator and updates the row text (`Response: Medium • Model: GPT Prose • Tone: Neutral`).
- Theme toggle with persisted preference, data-theme driven tokens, and Framer Motion micro-interactions (message fade/slide, floating empty state, typing dots).
- Tests covering reply routing, attachments validation, and the send → typing → reply flow including auto-scroll behaviour.

## Options reference

- **Response Length** – Short trims detail, Long expands steps/bullets and adds follow-ups.
- **Model Voice** – `gpt-mini` keeps answers brisk, `gpt-prose` leans narrative, `gpt-tutor` appends deterministic learning tips.
- **Tone** – Neutral is direct, Friendly greets/closes warmly, Formal stays precise.

Attachments are acknowledged inline (with type hints) and influence the assistant’s opening context.

## Architecture notes

- `src/lib/agent` encapsulates deterministic reply rules and Markdown helpers that output ready-to-render Markdown strings.
- `src/store` uses tiny Zustand stores: one for chat flow (with simulated typing delay) and one persisted options store.
- `src/components` holds chat surfaces, theme utilities, and shadcn/ui primitives, mirroring the project structure described in the spec.
- `MarkdownContent` uses `react-markdown`, `remark-gfm`, and a sanitised rehype pipeline with syntax highlighting-friendly allowances.
- Tests live in `src/__tests__`, driven by Vitest + React Testing Library.

## Known trade-offs / TODOs

- Reply rules are intentionally opinionated; expanding the DSL would improve maintainability if more styles are needed.
- No persistence for chat history yet—refreshing clears messages (options persist via `localStorage`).
- Syntax highlighting relies on the default `rehype-highlight` theme; bespoke theming could better match the UI palette.

## Implementation notes

- No network calls or `Math.random`; all behaviour is rule-based and deterministic.
- Tailwind config keeps the palette shadcn-compatible and enables typography + animation utilities.
- Husky + lint-staged run ESLint (strict TypeScript) and Prettier on staged files before commits.
- Prefer composition over prop drilling; business logic stays within `/lib/agent` and the Zustand stores.
