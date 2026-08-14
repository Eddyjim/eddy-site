# eddy-site Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-14

## Active Technologies
- JavaScript (ES2022+), Vue 3.2+ + Vue 3, Vue Router 4, Bootstrap 5.3, Bootstrap Icons, Marked, js-yaml (new), vue-i18n (new), SASS (001-homepage-hire-cv)
- Locale-suffixed YAML files in `public/content/cv/`, static PDFs per language in `public/content/cv/` (001-homepage-hire-cv)

- JavaScript (ES2022+), Vue 3.2+ + Vue 3, Vue Router 4, Bootstrap 5.3, Bootstrap Icons, Marked, js-yaml (new), SASS (001-homepage-hire-cv)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

Note: `package.json` defines neither `test` nor `lint` as of 2026-08-14; the
line above is aspirational. `npm run build` is the working verification.

## Branching

GitFlow: `feature/*` → `develop` → `release/x.y.z` → `main`. Production deploys
on push to `main`, staging on push to `develop` (`.github/workflows/ci-cd.yml`).

**`main` must stay an ancestor of `develop`.** Releases merge into `main` and do
not return on their own, so `main` accumulates commits unreachable from `develop`
and the branches diverge — that is what made `release/1.4.0` → `main`
unmergeable. `.github/workflows/back-merge.yml` now runs after every push to
`main` and either pushes the back-merge or opens a PR for it. If a release
branch ever fails to merge into `main`, check this first:

```sh
git merge-base --is-ancestor origin/main origin/develop   # must succeed
```

Note `develop` currently has `lock_branch: true` plus a required review, and
self-approval is impossible, so every merge into it needs `gh pr merge --admin`.

## CV generation

`public/content/cv/*.yaml` is the single source of truth for the site **and**
the PDFs. Run `npm run cv` (optionally `npm run cv -- en` or `-- en:short`).

- **Never hand-edit LaTeX.** `cv/generated/*.tex` is build output and gitignored.
  The old hand-maintained `cv/*.tex` files were deleted precisely because they
  drifted from the YAML.
- Six variants: `{en,es}` × `{short, detailed, ats}`, defined in `VARIANTS` in
  `scripts/build-cv.mjs`. Short CVs have an enforced 1-page budget; the build
  fails if exceeded.
- The `ats` variants are single-column and plain, for job-portal uploads. The
  two-column designed layout interleaves skills and job titles when a parser
  extracts text, which is why the plain twin exists. Keep them single-column,
  free of tabular text and decorative glyphs.
- Requires `pdflatex` at `/Library/TeX/texbin/pdflatex`.
- `src/lib/coreStack.mjs` derives the headline "core stack" and is imported by
  **both** the generator and `CoreStack.vue` on /hire-me. Change the rule there,
  never in one consumer, or the PDF and the site will advertise different stacks.

Note: ESLint is a devDependency but the project has no ESLint config, so
`npx eslint` fails. Worth setting up if linting is expected.

## Code Style

JavaScript (ES2022+), Vue 3.2+: Follow standard conventions

## Recent Changes
- 001-homepage-hire-cv: Added JavaScript (ES2022+), Vue 3.2+ + Vue 3, Vue Router 4, Bootstrap 5.3, Bootstrap Icons, Marked, js-yaml (new), vue-i18n (new), SASS

- 001-homepage-hire-cv: Added JavaScript (ES2022+), Vue 3.2+ + Vue 3, Vue Router 4, Bootstrap 5.3, Bootstrap Icons, Marked, js-yaml (new), SASS

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
