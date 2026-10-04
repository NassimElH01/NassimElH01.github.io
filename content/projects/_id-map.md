# Project id map (legacy → content/projects)

Old ids come from `legacy/vite-spa/src/data/projectsData.ts` (and `cvData.ts` where noted). The `_` prefix keeps this file out of the Astro collection.

| Old id | New id | Note |
| --- | --- | --- |
| `strength-conditioning-tracking` | `strength-conditioning-tracking` | unchanged |
| `24support-julekalender` | `24support-christmas-calendar` | renamed |
| `ss-rengoringservice-website` | `ss-rengoringsservice-website` | spelling fixed to match the company domain |
| `royal-unibrew-project` | `royal-unibrew-ot-security-bachelor-project` | renamed; merged with cvData `royal-unibrew-bachelor-project` |
| `data-integration-visualizer` | `data-integration-process-case` | renamed; `draft: true` |

## Not migrated

- Demos committed by Can Kurt, the author of the template this site was forked from, are not Nassim's work and were not migrated: `ascension-cards`, `web-shooter` (hand-gesture demo), `flight-world-3d`, `budget-model` (Excel template), `arcade-games` (Snake, Pong, Blackjack, Vanekort), Posture-checker, and the demos in `legacy/vite-spa/src/components/projects/` (DebtSimulator, ProcessVisualizer, ComplianceInspector).
- `ibm-data-analytics` (project card) was not migrated as a project. The IBM certificates are in `content/certifications.yaml`.
