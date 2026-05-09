# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the Astro site source. Routes live in `src/pages/`, layouts in `src/layouts/`, and UI components in `src/components/` (PascalCase `.astro`/`.svelte`).
- Content lives in `src/content/` (posts under `src/content/posts/<slug>/` and static pages under `src/content/spec/`).
- Static assets are split between `public/` (served as-is) and `src/assets/` (processed by the build).
- Tests live in `tests/`, with Playwright snapshots stored in `tests/*.spec.ts-snapshots/`.
- Build output goes to `dist/`.

## Build, Test, and Development Commands

Use `aube` (the repo pins it via `packageManager`).

- `aube dev`: start the Astro dev server at `http://localhost:4321`.
- `aube build`: build the site and generate Pagefind search for `dist/`.
- `aube preview`: preview the production build locally.
- `aube check`: run Astro’s project checks.
- `aube type-check`: TypeScript type checks.
- `aube lint` / `aube lint:fix`: run Oxlint.
- `aube fmt` / `aube fmt:check`: run Oxfmt.
- `aube test`: run Playwright tests.
- `aube test:update`: update Playwright snapshots.
- `aube new-post`: scaffold a new post.

## Coding Style & Naming Conventions

- Formatting is handled by Oxfmt (`.oxfmtrc.json`); linting is handled by Oxlint.
- Indentation uses tabs; JavaScript/TypeScript strings default to double quotes.
- Components use PascalCase filenames (e.g., `PostCard.astro`).
- Content slugs are directory names under `src/content/posts/` (typically kebab-case or date-based).

## Testing Guidelines

- Tests are Playwright-based (`tests/*.spec.ts`).
- Visual snapshots live in `tests/*.spec.ts-snapshots/`.
- `aube test` spins up the dev server automatically; run `aube test:update` when intentional UI changes occur.

## Commit & Pull Request Guidelines

- Recent commits are short, imperative, and lower-case (e.g., “fix format”, “update about”).
- PRs should include a concise description, link related issues, and add screenshots for UI changes.
- Ensure formatting, linting, and relevant tests pass before requesting review.

## Content & Data Updates

- Content updates belong in `src/content/` and should match existing frontmatter patterns.
- Data refresh scripts live in `scripts/` (e.g., `aube update-zenn`, `aube fetch-sponsors`).
