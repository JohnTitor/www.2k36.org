# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the Astro site source. Routes live in `src/pages/`, layouts in `src/layouts/`, and UI components in `src/components/` (PascalCase `.astro`/`.svelte`).
- Content lives in `src/content/` (posts under `src/content/posts/<slug>/` and static pages under `src/content/spec/`).
- Static assets are split between `public/` (served as-is) and `src/assets/` (processed by the build).
- Tests live in `tests/`, with Playwright snapshots stored in `tests/*.spec.ts-snapshots/`.
- Build output goes to `dist/`.

## Build, Test, and Development Commands

Use `pnpm` (the repo enforces it via `preinstall`).

- `pnpm dev`: start the Astro dev server at `http://localhost:4321`.
- `pnpm build`: build the site and generate Pagefind search for `dist/`.
- `pnpm preview`: preview the production build locally.
- `pnpm check`: run Astro’s project checks.
- `pnpm type-check`: TypeScript type checks.
- `pnpm lint` / `pnpm lint:fix`: run Oxlint.
- `pnpm fmt` / `pnpm fmt:check`: run Oxfmt.
- `pnpm test`: run Playwright tests.
- `pnpm test:update`: update Playwright snapshots.
- `pnpm new-post`: scaffold a new post.

## Coding Style & Naming Conventions

- Formatting is handled by Oxfmt (`.oxfmtrc.json`); linting is handled by Oxlint.
- Indentation uses tabs; JavaScript/TypeScript strings default to double quotes.
- Components use PascalCase filenames (e.g., `PostCard.astro`).
- Content slugs are directory names under `src/content/posts/` (typically kebab-case or date-based).

## Testing Guidelines

- Tests are Playwright-based (`tests/*.spec.ts`).
- Visual snapshots live in `tests/*.spec.ts-snapshots/`.
- `pnpm test` spins up the dev server automatically; run `pnpm test:update` when intentional UI changes occur.

## Commit & Pull Request Guidelines

- Recent commits are short, imperative, and lower-case (e.g., “fix format”, “update about”).
- PRs should include a concise description, link related issues, and add screenshots for UI changes.
- Ensure formatting, linting, and relevant tests pass before requesting review.

## Content & Data Updates

- Content updates belong in `src/content/` and should match existing frontmatter patterns.
- Data refresh scripts live in `scripts/` (e.g., `pnpm update-zenn`, `pnpm fetch-sponsors`).
