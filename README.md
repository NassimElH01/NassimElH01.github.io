# nassimelh01.github.io

Personal portfolio of Nassim Hassani. It is a static site on GitHub Pages, built with Astro, TypeScript and Tailwind CSS.

The design direction is "The Translator": paper and ink, an orange bridge line, and Instrument Serif, Geist and Geist Mono. See [`docs/design-direction.md`](docs/design-direction.md). The project rules live in [`CLAUDE.md`](CLAUDE.md).

## Requirements

- Node 24 (see `.nvmrc`; `>=22.19` works)
- npm

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:4321 (drafts and TODO badges visible) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run check` | Type-check `.astro` and `.ts`, and validate content against the schema |
| `npm run lint` | ESLint, including accessibility rules for `.astro` |
| `npm run test:e2e` | Playwright smoke, axe, keyboard, theme and reduced-motion tests against the build |
| `npm run content:todos` | List every `TODO:` left in `content/` |
| `npm run verify:no-todo` | Fail if the built pages still contain a `TODO:` (the deploy gate) |
| `npm run brand:assets` | Re-render `favicon.ico`, `apple-touch-icon.png` and `og/default.png` |

## Content

All facts live in `content/`, validated by [`src/content.config.ts`](src/content.config.ts):

```
content/
├─ profile.yaml         name, links, contact, interests
├─ languages.yaml       spoken languages and levels
├─ certifications.yaml
├─ timeline/*.md        experience, education and volunteering (frontmatter only)
├─ projects/*.md        one file per project (frontmatter only; /add-project)
└─ skills/*.yaml        one file per skill group; every skill says where it was used
```

**Never guess.** A missing fact is written as a string starting with `TODO:`.
- In `npm run dev` it shows as a dashed badge.
- In production it is never rendered as copy. The page instead gets a hidden `data-todo` marker.
- Bilingual fields need both `en` and `da`. A missing translation is `TODO: translate`.
- Projects with `draft: true` only appear in dev.
- A timeline entry may be `undated: true` only when every source lists it without dates, as the CV does under "Øvrig erhvervserfaring". An unknown date is still a `TODO:`.

## Languages

English is the default at `/`, and Danish lives at `/da/`. UI strings are in [`src/i18n/ui.ts`](src/i18n/ui.ts). The Danish dictionary is typed against the English one, so a missing key fails `npm run check`.

## Static files and old demos

- Files in `public/` are served unchanged. That includes the freelance demo at `/freelance/24support-julekalender/`.
- `legacy/` holds the previous Vite site and demos whose authorship is unconfirmed. Nothing in it is built or deployed (see [`legacy/README.md`](legacy/README.md)).

## Deploy

`.github/workflows/deploy.yml`:
- **Pull requests:** check, lint, build and test, plus a TODO report. They never deploy.
- **Push to `main`:** the same checks, then a blocking TODO gate (`content:todos --strict` and `verify:no-todo`), then deploy to GitHub Pages.
- **Effect of the gate:** a page with unfinished content cannot go live, and the last deployed version stays up.
