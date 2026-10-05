# Project id map (legacy → content/projects)

Old ids come from `legacy/vite-spa/src/data/projectsData.ts` (and `cvData.ts` where noted). The `_` prefix keeps this file out of the Astro collection.

| Old id | New id | Note |
| --- | --- | --- |
| `strength-conditioning-tracking` | `strength-conditioning-tracking` | unchanged |
| `24support-julekalender` | `24support-christmas-calendar` | renamed |
| `ss-rengoringservice-website` | `ss-rengoringsservice-website` | spelling fixed to match the company domain |
| `royal-unibrew-project` | `royal-unibrew-hybrid-pmo-bachelor-project` | renamed to the bachelor title on both CVs ("Fra Vandfald til Hybrid PMO"); merged with cvData `royal-unibrew-bachelor-project`; the old "OT Cyber Security" framing is left out (the CVs win; in the internship report OT Cyber Security is an internship project, see `content/timeline/royal-unibrew-pmo.md`). Owner answers 2026-10-05: solo, 2025, grade 10 |
| `data-integration-visualizer` | `data-integration-process-case` | renamed; `draft: true` |
| `ascension-cards` | `ascension-cards` | authorship confirmed by the owner on 2026-10-04 (commits under the "Can Kurt" git identity) |
| `flight-world-3d` | `ascension-cards` | merged: FlightWorld 3D is part of the Ascension Cards app (the old card opened the same game) |
| `arcade-games` | `canvas-arcade` | renamed; authorship confirmed 2026-10-04; Snake, Pong, Blackjack, Vanekort |
| `budget-model` | `budget-model` | authorship confirmed 2026-10-04; links to `/budget-skabelon.xlsx` |
| Posture-checker (`legacy/posture-checker/`, no old id) | `posture-checker` | authorship confirmed 2026-10-04; was never on the old site |

## New entries (no legacy id)

- `royal-unibrew-projectflow-power-bi`: from the Royal Unibrew internship report and CV-2.
- `genai-ml-elective`: from the Gen AI & Machine learning elective exam.

## Not migrated

- Stay in `legacy/`, not confirmed by the owner as his projects: `web-shooter` (hand-gesture demo; it also uses Marvel character names) and the demos in `legacy/vite-spa/src/components/projects/` (DebtSimulator, ProcessVisualizer, ComplianceInspector).
- `ibm-data-analytics` (project card) was not migrated as a project. The IBM certificates are in `content/certifications.yaml`.
