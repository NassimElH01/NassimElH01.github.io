---
# Authorship confirmed by the owner on 2026-10-04 (commits are under the 'Can Kurt' git identity).
# Source: OLD-SITE legacy/posture-checker/index.html, sketch.js and style.css. The project was not
# described on the old site, so everything below describes only what the code shows.
# The interface in the code is Danish; the English is a faithful description.
# No `link`/`repo`: legacy/README.md notes the sketch was never deployed, and it has no repository of its own.
# demo: TODO — port the playable demo in the Projects/Playground step (source in legacy/);
#   it uses the webcam, so the ported demo needs `needsCamera: true`.
# Source: OLD-SITE (index.html <title> "Femtech 65+ | Surveillance Mirror"; sketch.js header
# "Posture Checker with MoveNet Pose Estimation")
title:
  en: "Femtech 65+ Surveillance Mirror (posture checker)"
  da: "Femtech 65+ Surveillance Mirror (holdningstjek)"
# Not dated: git history has a single upload of the finished sketch (a29d69b, 2026-09-14), with no
# development history. That shows only when it was added, not when it was built. The owner gave no year.
year: "TODO: year — owner to confirm (uploaded to the repo in September 2026; build year unknown)"
# Source: the owner's answers (2026-10-05): the four confirmed projects are personal projects.
context: "personal"
problem:
  en: "TODO: the brief behind 'Femtech 65+' (who it was for and why) — owner to confirm"
  da: "TODO: opgaven bag 'Femtech 65+' (hvem den var til og hvorfor) — ejer bekræfter"
# Source: the owner's answers (2026-10-04: his work; 2026-10-05: personal)
role:
  en: "Nassim's own personal project."
  da: "Nassims eget personlige projekt."
# Source: OLD-SITE (legacy/posture-checker/sketch.js: ml5.bodyPose("MoveNet") on a createCapture
# webcam feed, lines 34-52 and 109-206; analyzePosture() shoulder delta in px, tilt in degrees,
# 0-100 score and three thresholds, lines 330-369; lerp smoothing, line 527; drawSkeleton() and
# drawSurveillanceOverlay(), lines 374-476; mirror toggle and FPS, lines 92-97 and 236-243;
# camera error and file:// messages, lines 100-206. index.html: lang="da" and Danish labels.)
method:
  en: "A browser sketch in p5.js that uses the webcam and ml5's bodyPose model (MoveNet) to track the shoulders and the nose. It measures the height difference between the shoulders in pixels and the tilt angle in degrees, turns them into a smoothed posture score from 0 to 100 and shows one of three states: optimal, a slight tilt, or a warning to correct the posture. The shoulder line, a horizontal reference line and a crosshair on the nose are drawn over a mirrored video feed in a surveillance-style HUD, with a mirror toggle, an FPS readout and clear messages when camera access is blocked. The interface is in Danish."
  da: "En browserskitse i p5.js, der bruger webkameraet og ml5's bodyPose-model (MoveNet) til at spore skuldre og næse. Den måler højdeforskellen mellem skuldrene i pixels og hældningsvinklen i grader, omsætter dem til en udjævnet holdningsscore fra 0 til 100 og viser en af tre tilstande: optimal, let skævhed eller en advarsel om at korrigere holdningen. Skulderlinjen, en vandret referencelinje og et sigtekorn på næsen tegnes oven på et spejlvendt videobillede i et overvågningsinspireret HUD med knap til spejlvending, FPS-visning og tydelige beskeder, hvis kameraadgangen er blokeret. Brugerfladen er på dansk."
# Source: OLD-SITE (legacy/posture-checker/index.html script tags: p5.js 1.9.0 and ml5@1;
# sketch.js ml5.bodyPose("MoveNet"); style.css)
technology:
  - "p5.js"
  - "ml5.js"
  - "MoveNet (bodyPose)"
  - "JavaScript"
  - "HTML"
  - "CSS"
result:
  en: "TODO: outcome — owner to confirm (was it presented, tested or used?)"
  da: "TODO: resultat — ejer bekræfter (blev den præsenteret, testet eller brugt?)"
featured: false
order: 11
---
