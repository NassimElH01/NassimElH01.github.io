---
# Source: legacy projectsData id "24support-julekalender" (authored by NassimElH01).
# The old githubUrl pointed at the bare GitHub profile, so there is no `repo` field.
# method.da follows Nassim's later EN wording "responsive"; his older DA line said "skalerbar".
# The owner's answer (2026-10-06) confirms that he built the whole solution, server and admin tool
# included: "Ja det gjort jeg ved at indsamle use case og programering igennem claude og co pilot.
# Og sætter hjemmeside op selv med domæne og https setuppet".
title:
  en: "24Support Christmas Calendar 2026"
  da: "24Support Julekalender 2026"
# Source: git history (the demo was committed by NassimElH01 on 2026-09-21 and 2026-09-26, commits
# 0128be1 and 0f707c3) and the title (the 2026 edition).
year: 2026
context: "freelance"
problem:
  en: "TODO: what 24Support needed — owner to confirm"
  da: "TODO: hvad 24Support havde brug for — ejer bekræfter"
# Source: the owner's answer (2026-10-06, quoted above) and OLD-SITE (projectsData.ts
# "24support-julekalender": "en separat Node.js-server til datostyring og et loginbeskyttet
# adminværktøj"). The question was about the server and the admin tool, so Claude and Copilot are
# tied to those two; the calendar design is from OLD-SITE (highlights). He wrote "co pilot", so the
# product is not named beyond "Copilot".
role:
  en: "Nassim built the whole solution himself. He designed the calendar, and he programmed the server that controls when each door opens and the login-protected admin tool with Claude and Copilot, based on use cases he collected. He also set the site up on its own domain with HTTPS."
  da: "Nassim byggede hele løsningen selv. Han designede kalenderen og programmerede serveren, der styrer, hvornår hver låge åbner, og det loginbeskyttede adminværktøj med Claude og Copilot ud fra use cases, han selv indsamlede. Han satte også siden op på eget domæne med HTTPS."
method:
  en: "Designed a responsive 16:9 experience with Danish townhouses, animation, snowfall and interactions, and built 24 interactive doors with keyboard support and saved demo progress. The public portfolio demo uses sample content only."
  da: "Designede en responsiv 16:9-oplevelse med danske byhuse, animationer, snefald og interaktioner og udviklede 24 interaktive låger med tastaturbetjening og gemt demo-fremdrift. Den offentlige portfolio-demo bruger kun eksempelindhold."
technology:
  - "HTML"
  - "CSS"
  - "JavaScript"
  # Source: OLD-SITE (Node.js server, see role) and the owner's answer (domain and HTTPS)
  - "Node.js"
  - "HTTPS"
# Source: the title (the 2026 edition), the owner's answer (2026-10-06: domain and HTTPS set up) and
# the demo in public/freelance/24support-julekalender/ (OLD-SITE: "Den offentlige portfolio-demo
# bruger kun eksempelindhold"). No claim about 24Support's use or approval: no source gives one.
# Two sentences, as the owner asked.
result:
  en: "The calendar is built for December 2026 and runs on its own domain together with its server and admin tool. A public demo with sample content is available to try on this site."
  da: "Kalenderen er bygget til december 2026 og kører på eget domæne med tilhørende server og adminværktøj. En offentlig demo med eksempelindhold kan afprøves her på siden."
link: "/freelance/24support-julekalender/index.html"
linkLabel:
  en: "Open calendar demo"
  da: "Åbn kalenderdemo"
demo:
  kind: "iframe"
  src: "/freelance/24support-julekalender/index.html"
featured: true
order: 3
---
