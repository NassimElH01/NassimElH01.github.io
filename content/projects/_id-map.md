# Project id map (legacy → content/projects)

Old ids come from `legacy/vite-spa/src/data/projectsData.ts` (and `cvData.ts` where noted). The `_` prefix keeps this file out of the Astro collection.

| Old id | New id | Note |
| --- | --- | --- |
| `strength-conditioning-tracking` | `strength-conditioning-tracking` | unchanged |
| `24support-julekalender` | `24support-christmas-calendar` | renamed |
| `ss-rengoringservice-website` | `ss-rengoringsservice-website` | spelling fixed to match the company domain |
| `royal-unibrew-project` | `royal-unibrew-hybrid-pmo-bachelor-project` | renamed to the bachelor title on both CVs ("Fra Vandfald til Hybrid PMO"); merged with cvData `royal-unibrew-bachelor-project`; the old "OT Cyber Security" framing is left out (settled by the bachelor PDF: cover title, abstract and research question p.8; in the internship report OT Cyber Security is an internship project, see `content/timeline/royal-unibrew-pmo.md`). Owner answers 2026-10-05: solo, grade 10; 2026-10-06: the bachelor PDF (dated 12-01-2026), year 2026 |
| `data-integration-visualizer` | (removed) | the owner asked on 2026-10-06 for the old draft "Data Integration & Process Optimization Case" to be deleted |
| `ascension-cards` | `ascension-cards` | authorship confirmed by the owner on 2026-10-04 (commits under the "Can Kurt" git identity) |
| `flight-world-3d` | `ascension-cards` | merged: FlightWorld 3D is part of the Ascension Cards app (the old card opened the same game) |
| `arcade-games` | `canvas-arcade` | renamed; authorship confirmed 2026-10-04; Snake, Pong, Blackjack, Vanekort |
| `budget-model` | `budget-model` | authorship confirmed 2026-10-04; links to `/budget-skabelon.xlsx` |
| Posture-checker (`legacy/posture-checker/`, no old id) | `posture-checker` | authorship confirmed 2026-10-04; was never on the old site |

## New entries (no legacy id)

- `royal-unibrew-projectflow-power-bi`: from the Royal Unibrew internship report and CV-2.
- `genai-ml-elective`: from the Gen AI & Machine learning elective exam.
- `enhanced-security-synopsis`: from the Enhanced Security elective exam (individual, confirmed 2026-10-06).
- `tjekkit`: from the owner's text pack (OWNER-PDF p.7-8, shared 2026-10-11) and the owner's answers of 2026-10-11 (group project, 2nd semester, handed in 26 May 2023; second round: Nassim did the wireframes and the prototype, and the system was not finished). No repo link (the PDF's link is a placeholder).
- `airbnb-eda`: from OWNER-PDF p.9-10 and p.16 (IBM Data Analyst capstone) and the owner's answers of 2026-10-11 (Grade A, full score; the PDF's "12" is not used).
- `ibm-cybersecurity-lab`: from IBM's evaluation of the IBM Cybersecurity Analyst capstone, pasted by the owner on 2026-10-11 (five tasks, 2 January 2024, Grade A, 50/50), and OWNER-PDF p.6-7, p.10-11 and p.16. The evaluator's name is not published.
- `freelance-web`: from OWNER-PDF p.1 and p.11-12 and the owner's answers of 2026-10-11 (general, no client names).

## Not migrated

- Stay in `legacy/`, not confirmed by the owner as his projects: `web-shooter` (hand-gesture demo; it also uses Marvel character names) and the demos in `legacy/vite-spa/src/components/projects/` (DebtSimulator, ProcessVisualizer, ComplianceInspector).
- `ibm-data-analytics` (project card "IBM Data Analytics & Cybersecurity Capstone") was not migrated: its text was generic and unsourced. The two IBM capstones now have their own entries, `airbnb-eda` and `ibm-cybersecurity-lab`, built from the owner's 2026-10-11 sources, not from the old card. The IBM certificates are in `content/certifications.yaml`.
