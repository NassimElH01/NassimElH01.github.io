---
name: portfolio-claim-check
description: Read-only check that Nassim Hassani's portfolio (this repo, nassimelh01.github.io) follows the owner's rules in CLAUDE.md — every visible claim traceable to _kilder/ or <facts>, nothing from <pending> visible, no confidential OT or Bilag terms, no phone number, no TODO, first person in English and Danish. Use it whenever the site's content is checked, audited, reviewed before a merge or deploy, or in the weekly portfolio check, and whenever someone asks whether the site "says anything it can't back up", even if they don't name this skill. It reports; it never edits, commits or pushes.
---

# Portfolio claim check

The site exists to land a student job, so one claim a recruiter can't verify costs more than a missing one. CLAUDE.md holds the owner's rules (`<rules>`), his clarified facts (`<facts>`) and what waits for his answer (`<pending>`). This skill checks the built site against them and reports what breaks them. It changes nothing: the owner, or the session he asks, makes the fixes.

## Steps

1. **Build what you check.** Run `npm ci` if `node_modules/` is missing, then `npm run build`. The check reads `dist/`, so an old build gives an old answer.
2. **Run the script:**
   ```bash
   node .claude/skills/portfolio-claim-check/scripts/claim-check.mjs
   ```
   - **FAIL** lines are hard breaks of the rules, found in the text a visitor or a screen reader gets: a phone number, a TODO, a word the facts rule out, something `<pending>` keeps hidden, third person, a confidential term, a PDF link other than the owner's CV. Exit code 1 means at least one.
   - **LEAD** lines are content fields whose `# Source:` comment cites only the AI-written OWNER-PDF, only an owner statement that is not in `_kilder/`, or nothing at all. They are leads, not verdicts: the script reads comments, not the sources.
   - **NOTE** says what could not be checked (e.g. no `_kilder/confidential-terms.txt` in a fresh clone).
3. **Read the rules yourself.** Open CLAUDE.md and read `<rules>`, `<facts>` and `<pending>`. The script's word list follows them as of 2026-10-12. If they have changed since, check the new lines by hand, and say in the report that the script needs the update (its patterns name the CLAUDE.md line they come from).
4. **Follow up the leads**, most visible first: hero, About, the featured projects, Experience, Skills, the rest.
   - **With `_kilder/`** (the owner's private sources; gitignored, so only in a session where he uploaded them): open the source the comment names and check that it says what the site says. A claim may say less than its source, never more.
   - **Without `_kilder/`** (a fresh clone, the weekly routine): you cannot verify against the sources. List the leads as "kan ikke verificeres her" and check only what the repo itself shows: `<facts>`, git history, code under `legacy/` and `public/`.
5. **Check what the script cannot judge:**
   - **Pending 1:** the p5.js project names no role beyond "course project".
   - **Facts as the ceiling:** each value the facts give matches the site (location, Royal Unibrew months, grades, IBM wording, the bachelor sentence, the OT role, the 12 skills). The site may say less, never more.
   - **Both languages:** they say the same thing.
6. **Optionally:** run `npm run test:e2e` and Lighthouse (mobile, `/` and `/da/`; rule 5 wants 100) when the request includes them.

## Report

Write the report in Danish, short, and in this order:

```
## Portfolio-tjek <dato> (<commit-sha>)
**Resultat:** <n> brud på reglerne, <n> påstande uden kilde, <n> kunne ikke verificeres.

### Brud (skal rettes)
- <regel>: <hvor> — <hvad> (forslag: <mindste rettelse, på begge sprog>)

### Påstande uden kilde
- <fil:felt> — "<påstanden>" — <hvad kilden siger, eller at ingen gør>

### Kunne ikke verificeres her
- <hvad og hvorfor>

### Tests og Lighthouse (hvis kørt)
```

Never quote the sources beyond the few words a finding needs. They are private (rule 2). Never name a person from them, and never repeat a confidential term the script found: say "fortrolig term i <fil>".

## What this skill does not do

It does not edit content, commit, push or open pull requests, even when a fix is obvious. Put the fix in the report as a proposal. When the weekly routine asks "Skal sitet ændres?", the answer is no: report, and leave the change to the session the owner asks.
