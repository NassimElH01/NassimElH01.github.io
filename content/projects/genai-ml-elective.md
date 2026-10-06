---
# Source: EXAM ("Machine learning & Gen AI – 5. Semester Valgfags eksamen", Økonomi & IT, Zealand;
# PDF page numbers from extract-exam.json). Danish follows the exam's own wording; English is a
# faithful translation.
# Not published on purpose: the UFC fighters, the charity and the club's branding that appear in
# the exam's communication products, and the HeyGen video of Nassim himself.
# Notebook links: see `links` below.
# Source: EXAM (p.1: "Machine learning & Gen AI", "Valgfags eksamen"); title wording per the lead's brief
title:
  en: "Generative AI & Machine Learning elective"
  da: "Generativ AI & machine learning (valgfag)"
# Source: EXAM (p.1-2: 5th semester Økonomi & IT; p.15: an event dated "1. november 2024");
# fits the PBA 2022–2026 in CV-2
year: 2024
# Source: EXAM (p.1: elective exam at Zealand)
context: "study"
# Source: EXAM (p.18: "jeg valgte Badr Fight Club", the analysis assignment; p.19: communication
# product and promo video "for virksomheden"; p.21: the Machine-learning notebook assignments;
# company description section: Badr Fight Club "er en kampsportsklub beliggende i Glostrup")
problem:
  en: "Use generative AI tools to produce a strategic analysis and marketing material for a local martial arts club, Badr Fight Club, and complete a set of machine-learning notebooks in Python."
  da: "At bruge generative AI-værktøjer til at udarbejde en strategisk analyse og markedsføringsmateriale til en lokal kampsportsklub, Badr Fight Club, og løse en række machine learning-opgaver i Python-notebooks."
# Source: EXAM (p.1: only Nassim Hassani is named, on the cover and every page header; p.18:
# written in the first person, "jeg valgte Badr Fight Club")
role:
  en: "Individual exam project: all the work was done solo."
  da: "Individuelt eksamensprojekt: alt arbejdet er udført alene."
# Source: EXAM (p.18: "startede jeg med at bede den om hjælp til at formulere den bedst mulige
# prompt", "eksperimenterede med at forbedre promptene", "BMC, regnskabsanalyse, Porter's Five
# Forces og PESTEL", "SWOT", "SMP-analyse (segmentering, målgruppevalg og positionering)",
# "handlingsplan i form af et Gantt-kort"; p.19: plakat med DALL-E, "gentagne forsøg", Adobe
# Firefly "som inspiration ... især på mere komplekse opgaver som landing pages"; InVideo with
# "autentiske optagelser" instead of stock video; HeyGen "genereret på arabisk ... for at nå ud til
# klubbens minoritetsgrupper i Danmark, hvor mange primært taler arabisk"; p.21: Google Colab,
# notebook titles Linear_Regression, Fashion_classification_neural_nets, ChatGPTChatSequence,
# ChatGPT_News_Generator, chatgpt_structured_output). Notebook titles only: the exam states no
# datasets, models or accuracy.
method:
  en: "Used meta-prompting in ChatGPT, first asking it to write the best possible prompt and then refining the prompts, to build a business analysis: Business Model Canvas, financial statement analysis, Porter's Five Forces, PESTEL, SWOT, an SMP analysis (segmentation, targeting and positioning) and an action plan as a Gantt chart. Made a poster with DALL-E, improving the text in the images through repeated attempts, and used Adobe Firefly as inspiration for harder visuals such as a landing-page sketch. Produced promo videos with InVideo using real footage instead of stock video, and with HeyGen made an Arabic-language version to reach the club's minority groups in Denmark, many of whom mainly speak Arabic. Completed machine-learning notebooks in Google Colab: linear regression, neural-network classification, and a ChatGPT chat sequence, news generator and structured output."
  da: "Brugte meta-prompting i ChatGPT, hvor den først blev bedt om at formulere den bedst mulige prompt, hvorefter promptene blev forbedret, til en forretningsanalyse: Business Model Canvas, regnskabsanalyse, Porter's Five Forces, PESTEL, SWOT, en SMP-analyse (segmentering, målgruppevalg og positionering) og en handlingsplan som Gantt-kort. Lavede en plakat med DALL-E og forbedrede teksten i billederne gennem gentagne forsøg og brugte Adobe Firefly som inspiration til sværere visuelle opgaver som en landing page-skitse. Producerede reklamevideoer med InVideo med autentiske optagelser i stedet for stockvideoer og lavede med HeyGen en arabisksproget version for at nå ud til klubbens minoritetsgrupper i Danmark, hvor mange primært taler arabisk. Løste machine learning-notebooks i Google Colab: lineær regression, klassifikation med neurale netværk samt en ChatGPT-chatsekvens, en nyhedsgenerator og struktureret output."
# Source: EXAM (p.18 ChatGPT; p.19 DALL-E, Adobe Firefly, HeyGen, InVideo; p.21 Google Colab,
# "Python-udvidelser", .ipynb notebooks)
technology:
  - "ChatGPT"
  - "DALL-E"
  - "Adobe Firefly"
  - "HeyGen"
  - "InVideo"
  - "Python"
  - "Google Colab"
result:
  en: "TODO: grade or outcome — the exam paper states none"
  da: "TODO: karakter eller resultat — eksamensopgaven nævner ingen"
# Source: EXAM (p.21, "Machine-learning": five gists under NassimElH01, labelled by task) and the
# owner's answers (2026-10-05: publish them). In the PDF text two IDs read "…686t78…" and "…5e6t76…":
# the "ff" ligature was extracted as "t". The IDs below come from gist.github.com/NassimElH01, and all
# five returned HTTP 200 on 2026-10-05. Labels follow the exam's task names.
links:
  - label:
      en: "Notebook: linear regression (task 1A)"
      da: "Notebook: lineær regression (opgave 1A)"
    href: "https://gist.github.com/NassimElH01/0864262cf43f4be38a7bc686ff78c6e3"
  - label:
      en: "Notebook: fashion classification with neural nets (task 1B)"
      da: "Notebook: klassifikation af tøj med neurale net (opgave 1B)"
    href: "https://gist.github.com/NassimElH01/7432e41fc6a1d18f1982faca6d64263b"
  - label:
      en: "Notebook: ChatGPT chat sequence (task 2)"
      da: "Notebook: ChatGPT-chatsekvens (opgave 2)"
    href: "https://gist.github.com/NassimElH01/08c0cdeecd130e184a43ceab155b8b47"
  - label:
      en: "Notebook: ChatGPT news generator (task 3A)"
      da: "Notebook: ChatGPT-nyhedsgenerator (opgave 3A)"
    href: "https://gist.github.com/NassimElH01/119c584579c38f70273845b4e9117a4d"
  - label:
      en: "Notebook: ChatGPT structured output (task 3B)"
      da: "Notebook: struktureret output med ChatGPT (opgave 3B)"
    href: "https://gist.github.com/NassimElH01/9e12a8d824aa6e17a2ba5e6ff7692dfb"
# Source: EXAM (p.2: Økonomi & IT, Zealand) and CV-2 (Zealand PBA 2022–2026)
timeline: "zealand-professionsbachelor"
featured: false
order: 7
---
