---
# Authorship confirmed by the owner on 2026-10-04 (commits are under the 'Can Kurt' git identity).
# Source: OLD-SITE legacy/vite-spa/src/data/projectsData.ts entry "arcade-games" (lines 236-253).
# The old text was Danish only; the English is a faithful translation. Vanekort is named only,
# from legacy/vite-spa/src/components/games/VanekortGame.tsx. The web-shooter demo stays excluded.
# The old site said the games were "bygget fra bunden med ren TypeScript og HTML5 Canvas", but
# the code shows Pong uses p5.js and Blackjack uses React + Framer Motion without a canvas, so
# that claim is flagged in technology instead of stated in method.
# No `link`/`repo`: the old githubUrl pointed at the bare GitHub profile.
# demo: TODO — port the playable demo in the Projects/Playground step (source in legacy/)
# Source: OLD-SITE (projectsData.ts "arcade-games", title, line 238; used unchanged on the Danish site)
title:
  en: "Canvas Arcade State Machines"
  da: "Canvas Arcade State Machines"
year: "TODO: year — owner to confirm"
context: "TODO: confirm — personal? (the old site filed it under 'Full Stack & Web App')"
problem:
  en: "TODO: why Nassim built the arcade — owner to confirm"
  da: "TODO: hvorfor Nassim byggede arkaden — ejer bekræfter"
role:
  en: "TODO: Nassim's role (sole developer?) — owner to confirm"
  da: "TODO: Nassims rolle (eneste udvikler?) — ejer bekræfter"
# Source: OLD-SITE (projectsData.ts "arcade-games": description, line 241; highlights, line 245).
# Vanekort is named only (VanekortGame.tsx is a habit tracker, not a card game; no description).
# Source: OLD-SITE (SnakeGame.tsx lines 16-17 and 108-110: "snakeHighScore" in localStorage). The
# old "Lokale highscore-systemer" (plural) is narrowed: only SnakeGame.tsx stores a high score.
# Left out on purpose (flagged, see technology): "Deterministiske spil-loops uafhængige af framerate"
# and "Responsive canvas-layouts tilpasset mobil og desktop" (Blackjack and Vanekort draw no canvas).
method:
  en: "A set of classic arcade games: Blackjack with casino rules, Snake with an input queue and collision detection, and Pong with vector reflection, plus Vanekort. Snake saves a local high score in localStorage."
  da: "En række klassiske arkadespil: Blackjack med casinoregler, Snake med input-kø og collision detection og Pong med vektor-refleksion samt Vanekort. Snake gemmer en lokal highscore i localStorage."
# Source: OLD-SITE (projectsData.ts "arcade-games" tags, line 242; highlights, lines 244 and 246).
# Flagged claims stay TODO.
technology:
  - "TypeScript"
  - "Canvas API"
  - "Framer Motion"
  - "TODO: confirm — framerate-independent deterministic game loops"
  - "TODO: confirm — responsive canvas layouts for mobile and desktop"
  - "TODO: confirm — 'built from scratch with pure TypeScript and HTML5 Canvas' (the code shows Pong uses p5.js, and Blackjack is React + Framer Motion without a canvas)"
result:
  en: "TODO: outcome — owner to confirm"
  da: "TODO: resultat — ejer bekræfter"
featured: false
order: 9
---
