# Design direction: "The Translator" (Oversætteren)

Chosen by the owner on 2026-10-04 out of three directions (Translator, Control Room, Dojo).
This file is the reference for every section build. It holds no content claims; facts live in `content/`.

## Idea
Nassim speaks Danish, English, Arabic and German, and translates between business and technology.
The site is a translation layer.

## Tokens
| Token | Light | Dark | Use |
|---|---|---|---|
| paper | `#F3F0E8` | `#0E0E0E` | page background |
| ink | `#111111` | `#EDEAE2` | text |
| signal | `#FF4F00` | `#FF6A2B` | large shapes and graphics only (2.89:1 on paper) |
| signal-text | `#C2410C` | `#FF6A2B` | orange text that must pass AA |
| steel | `#6B6F76` | `#8A8E95` | rules, decoration |
| steel-text | `#686C73` | `#8A8E95` | secondary text (AA) |

Focus ring: 2px outline plus 2px offset, ink in light mode and `#EDEAE2` in dark mode. Never orange on paper.

Measured contrast:
- ink on paper: 16.6:1
- steel-text: 4.63:1 (dark theme 5.87:1)
- signal-text: 4.55:1 (dark theme 6.76:1)
- signal on paper: 2.89:1

Any interactive orange control, such as the bridge handle, needs an ink outline, because WCAG 1.4.11 requires 3:1.

## Type
- Instrument Serif: display, the "business" voice
- Geist: body and UI
- Geist Mono: the "tech" voice

All three are OFL and self-hosted.

## Signature
- **Intro.** At most 1.6 s, skippable with Esc or a Skip button, once per session, static under reduced motion. The name starts as mono glyphs and "decodes" into serif. An orange bridge line then draws across and becomes the hero divider. Content renders underneath from the start, so the intro never blocks LCP.
- **Drag the bridge.** The hero is split by an orange handle. On the left is the statement in business language (serif, paper). On the right is the same statement as tech (mono, ink). The handle works with pointer, touch and arrow keys (`role="slider"`). The pattern repeats on project cards: a Business view (problem to result) and a Tech view (stack, architecture).
- **Skills** form a filterable "dictionary". Every skill shows where it was used (study, internship, freelance). No levels and no percentages.
- **Timeline.** The bridge continues as a vertical line through Experience and Education.

## Inspiration notes: todua.dk
Source: owner-supplied screenshots, desktop, dark theme. We borrow patterns only. Never copy its code, text or graphics.

**What it does**
- A loader with circular text around a personal emblem, plus "Portfolio Loading" dots. It is memorable but blocks the page, with no visible skip.
- A pill nav: name pill on the left, section pills in the centre with an active state, round theme toggle on the right. A thin scroll-progress bar sits at the top. Once scrolled, the transparent nav lets the content show through it.
- The hero has a "Currently at" chip with an org logo, a big two-line name with a gradient surname and a typewriter role. It adds icon meta lines, two CTAs (Download CV, Get in touch), social icons, a "Scroll to explore" cue and a portrait with decorative circles.
- Stat cards, then About with a pill label, a big heading and two-column cards.
- About pairs a "My Journey" text with value cards (Problem Solving, Innovation, Quality), a "What I Do" list and a language grid with CEFR levels.
- Projects are a carousel with a progress bar, arrows, dots and "3 of 4". Each slide holds an icon, a year chip, a context line (personal project, university, independent), a description, tag chips, a screenshot and an external-link icon.
- Skills are four static columns of chips: Frontend, Backend, Languages, Specializations.
- Contact has info cards (email, GitHub, LinkedIn) next to a contact form, plus a footer with a "Built with" line.
- In several screenshots the scrolled nav covers section headings, for example "Let's Work Together".

**What we adopt**
- A personal emblem in the intro: our bridge mark. It must be short, skippable and non-blocking.
- A "Now" chip in the hero, using verified facts only, such as the current study programme.
- Scroll progress drawn as the orange bridge line.
- Pill or segmented nav with an active section and a solid or blurred background. Content must never show through it.
- Stat tiles only with countable, verified facts. No "15+" style numbers.
- A portrait photo, once the owner supplies one (TODO), shown in paper and ink duotone.
- A language grid with levels. This fits "The Translator": four languages plus Business ⇄ Tech. German "intermediate" is verified; the other levels are TODO until the owner confirms them.
- Project metadata of year, context, tags, visual and link. Ours adds problem → role → result and the Business/Tech view.

**What we avoid**
- Dark navy with indigo
- Typewriter role text
- A loader that delays first content
- Gradient name text
- A project carousel. It hides cases from skimming recruiters and is harder to make accessible. We use a scannable grid or list instead.
- Skills as plain chip columns. Ours is the "dictionary" that shows where each skill was used.
- A contact form. It needs a backend or a third party, and the site must have no backend. We use a clear mailto, LinkedIn and CV download CTA.
- A nav that overlaps headings. Sections get `scroll-margin-top`, and the nav gets a solid background.

## Current site (before the rebuild), summary of findings
- Template look: a centred `max-w-4xl` column, an "NH" avatar and buzzword headline. Desktop is mostly empty margins, and mobile shows no content above the fold.
- Content hides behind tabs (CV, Projects, Games, Weather, News). Weather and News do not sell competencies.
- Mixed languages: with EN selected, about half the project cards are still in Danish.
- About 3 MB of JS on first load in one bundle.
