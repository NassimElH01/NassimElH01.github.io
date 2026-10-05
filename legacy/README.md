# legacy/

Nothing in this folder is built, linted, type-checked or deployed. It is kept
as porting reference and while the owner decides what happens to each part.
Restore anything with `git mv`.

| Path | What it is | Status |
|---|---|---|
| `vite-spa/` | The previous Vite + React + shadcn portfolio (source, configs, old `package.json`) | Reference for content migration and possible demo ports |
| `ascensioncards/` | Separate TanStack Start app source (Ascension Cards habit RPG) | Owner confirmed authorship (2026-10-04); now `content/projects/ascension-cards.md`, demo to be ported |
| `posture-checker/` | p5.js + ml5 camera sketch ("Femtech 65+ Surveillance Mirror"), never deployed | Owner confirmed authorship (2026-10-04); now `content/projects/posture-checker.md`, demo to be ported |
| `ASCENSION_MASTER_PROMPT.md` | Prompt notes for Ascension Cards | Goes with `ascensioncards/` |
| `public/games/web-shooter/` | p5.js camera demo that uses Marvel character names | Must be renamed to original powers before any reuse |
| `public/cards/` | Card art used by the legacy Vanekort game | Licence unknown; not reused until cleared |
| `public/ascensioncards/` | Old redirect page into the SPA games tab; `/ascensioncards/` now redirects to `/` | Kept for reference only |

Git history shows these demos under the "Can Kurt" identity. On 2026-10-04 the owner
confirmed that Ascension Cards (incl. FlightWorld 3D), the arcade games, the budget model
and the posture checker are his work. Those are now in `content/projects/` (the budget
template is served again from `public/`). The web-shooter demo stays here because it uses
Marvel character names, as do the `vite-spa/src/components/projects/` demos.
