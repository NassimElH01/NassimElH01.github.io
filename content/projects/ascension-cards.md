---
# Authorship confirmed by the owner on 2026-10-04 (commits are under the 'Can Kurt' git identity).
# Sources: OLD-SITE legacy/vite-spa/src/data/projectsData.ts entries "ascension-cards"
# (lines 163-181) and "flight-world-3d" (lines 200-217), legacy/ascensioncards/
# (README.md, package.json) and the file names in legacy/vite-spa/src/components/ascension/
# and ascension3d/. The old text was Danish only; the English is a faithful translation.
# FlightWorld 3D had its own card on the old site, but that card opened this same game
# (gameId "ascension-cards", projectsData.ts line 213) and its code is
# components/ascension3d/FlightWorld3D.tsx, so it is described here as part of Ascension Cards.
# No `link`/`repo`: the old githubUrl pointed at the bare GitHub profile, and the old
# href "/ascensioncards/" now only redirects to "/".
# demo: TODO — port the playable demo in the Projects/Playground step (source in legacy/)
# Source: OLD-SITE (projectsData.ts "ascension-cards", title; used unchanged on the Danish site)
title:
  en: "Ascension Cards — Habit RPG"
  da: "Ascension Cards — Habit RPG"
# Source: git history, commit dates only (not a year the owner confirmed): FlightWorld3D.tsx first
# committed on 2026-09-09 (1b5c8b4, src/components/ascension/), the Lovable app in ascensioncards/
# on 2026-09-12 (a092d0f). The local clone is shallow (cut at 2026-08-06); upstream history is older.
year: 2026
# Source: the owner's answers (2026-10-05): the four confirmed projects are personal projects.
context: "personal"
problem:
  en: "TODO: which need or idea started Ascension Cards — owner to confirm"
  da: "TODO: hvilket behov eller hvilken idé startede Ascension Cards — ejer bekræfter"
# Source: the owner's answers (2026-10-04: his work; 2026-10-05: personal) and
# legacy/ascensioncards/README.md (line 3: "This project was built with Lovable").
role:
  en: "Nassim's own personal project, built with the AI app builder Lovable."
  da: "Nassims eget personlige projekt, bygget med AI-appbyggeren Lovable."
# Source: OLD-SITE (projectsData.ts "ascension-cards": description and highlights, lines 168-173;
# "flight-world-3d": description and highlights, lines 205-209; screen and component names from
# the file names in legacy/vite-spa/src/components/ascension/screens/ and ascension3d/).
# Left out on purpose (flagged, see technology): "optimeret til høj performance" and
# "Performance-optimeret renderingloop med frustum culling".
method:
  en: "An immersive, card-based habit tracker and role-playing experience built with TanStack Start, Nitro and modern web technologies. It turns personal development and daily routines into a game with collectible cards, streaks and XP progression: interactive collectible cards with rarity levels and dynamic stats, and gamification with streaks, quests and an inventory system. The app has Today, Cards, Character, Campaign, World, Progress and Settings screens, a habit calendar, onboarding, a battle arena and a character gear panel. Part of the app is FlightWorld 3D, an interactive 3D flight simulation in Three.js with a dynamic third-person camera, floating procedural islands, atmospheric lighting and particle systems, custom flight physics with smooth camera damping, and procedural placement of 3D models and natural environments."
  da: "En fordybende, kortbaseret habit tracker og rollespilsoplevelse bygget med TanStack Start, Nitro og moderne webteknologier. Den gør personlig udvikling og daglige rutiner til et spil med samlekort, streaks og XP-progression: interaktive samlekort med sjældenhedsgrader og dynamisk statistik samt gamification med streaks, quests og et inventory-system. Appen har skærmene Today, Cards, Character, Campaign, World, Progress og Settings, en vanekalender, onboarding, en kamparena og et panel til karakterens udstyr. En del af appen er FlightWorld 3D, en interaktiv 3D-flyvesimulation med Three.js med dynamisk tredjepersons kameraføring, svævende procedurale øer, stemningsfulde lyskilder og partikelsystemer, specialdesignet flyvefysik med jævn kameradæmpning og procedural placering af 3D-modeller og naturmiljøer."
# Source: OLD-SITE (projectsData.ts "ascension-cards" tags, line 169; "flight-world-3d" tags,
# line 206) and legacy/ascensioncards/package.json (react ^19, @tanstack/react-start, nitro, three).
# Previously flagged claims stay TODO until the owner confirms them.
technology:
  - "React 19"
  - "TanStack Start"
  - "Nitro"
  - "Tailwind CSS"
  - "TypeScript"
  - "SSR"
  - "Three.js"
  - "WebGL"
  - "TODO: confirm — shaders (FlightWorld3D.tsx has a THREE.ShaderMaterial for the sky)"
  - "TODO: confirm — performance-optimised render loop with frustum culling"
  - "TODO: confirm — particle systems 'optimised for high performance'"
# Source: git history (FlightWorld3D.tsx committed 2026-09-09, the app 2026-09-12, both on the old
# site, which deployed from main), legacy/vite-spa/src/components/ascension3d/AscensionGame.tsx
# (lines 85 and 120: progress in localStorage) and the owner's answer (2026-10-06: he does not use
# it himself, but it is "et fedt projekt at vise"), so no usage claim. Two sentences, as the owner asked.
result:
  en: "A playable version went live on Nassim's previous portfolio in September 2026 and saved each player's progress locally in the browser. It included FlightWorld 3D, a 3D world that visitors could fly through."
  da: "En spilbar version blev lagt online på Nassims tidligere portfolio i september 2026 og gemte hver spillers fremskridt lokalt i browseren. Den indeholdt FlightWorld 3D, en 3D-verden, som besøgende kunne flyve rundt i."
featured: false
order: 8
---
