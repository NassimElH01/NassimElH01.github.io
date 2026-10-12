---
# Sources: OWNER-PDF, the owner's 18-page text pack ("Her er en komplet ... tekstpakke", shared
# 2026-10-11; written with an AI assistant, so used for facts only, never as copy; PDF page
# numbers), p.9-10 ("Airbnb Exploratory Data Analytics (IBM Capstone Project)") and p.16
# (6. Certificeringer: "IBM Data Analyst Professional Certificate | IBM SkillsBuild", capstone),
# and the owner's answers of 2026-10-11 ("Ja, også fuld score"), which override the PDF.
# Danish follows the PDF's facts; English is a faithful translation.
# CONFLICT: the PDF gives the capstone "Karakteren 12" (p.9 and p.16); the owner said "Grade A,
# full score" on 2026-10-11. CLAUDE.md <facts> (2026-10-12) wins over both: completed, no grade.
# CONFLICT (name): content/certifications.yaml lists "IBM Data Analytics" (LinkedIn: an IBM
# SkillsBuild certificate for the "Programme in Data Analytics", issued October 2023); the PDF
# calls it "IBM Data Analyst Professional Certificate". Owner to confirm they are the same.
# No link: no source gives one.
# Source: OWNER-PDF p.9 (title of the entry, "Airbnb Exploratory Data Analytics"; the data are
# Airbnb bookings, see problem below)
title:
  en: "Airbnb data analysis (IBM capstone)"
  da: "Airbnb-dataanalyse (IBM-capstone)"
# Claim audit 2026-10-12 (CLAUDE.md, rule 1): the owner's own words (owner-answers 2026-10-11: "Airbnb-dataanalyse (IBM)");
# "exploratory" and "bookings" were OWNER-PDF only.
# Source: owner 2026-10-11, second round ("2023"). Before that answer no source dated the
# capstone: the IBM Data Analytics certificate on LinkedIn is dated October 2023
# (content/certifications.yaml), and a certificate's year alone does not date its capstone.
year: 2023
# Source: OWNER-PDF p.16 (a capstone in an IBM professional certificate course, not the PBA).
# "study" is the closest context in the enum.
context: "study"
# Source: OWNER-PDF p.9 (Datagrundlag: "Analyse af et omfattende datasæt med over 100.000
# registreringer af Airbnb-bookinger i New York City"). The PDF states no business question.
problem:
  # Claim audit 2026-10-12 (CLAUDE.md, rule 1): the dataset (size, city) was OWNER-PDF only; waits for the IBM notebook in _kilder/.
  en: "TODO: the dataset — from the IBM Data Analytics notebook"
  da: "TODO: datasættet — fra IBM Data Analytics-notebooken"
# Source: OWNER-PDF p.9 ("Afsluttende Skriftligt Projekt") and p.16 (the final capstone of the IBM
# certificate course); owner 2026-10-11 (the Airbnb analysis is his IBM data analytics capstone).
# Not called "individual": no source says so (owner to confirm). The PDF's name "IBM Data Analyst
# Professional Certificate" is not used; CLAUDE.md, the CVs and LinkedIn say "IBM Data Analytics"
# (see the conflict note above).
role:
  en: "Capstone project: the final project of IBM's data analytics certificate course."
  da: "Capstone-projekt: det afsluttende projekt i IBM's certificeringsforløb i dataanalyse."
# Source: OWNER-PDF p.10 ("Data Loading og strukturanalyse via Pandas og NumPy"; "Frasortering af
# irrelevante kolonner, eliminering af over 3.400 duplikerede rækker samt systematisk imputation
# af manglende værdier (mode for kategoriske data, median for numeriske data)"; "Normalisering af
# kolonnenavne (snake_case), fjernelse af valutasymboler og kommaer via custom lambda-funktioner
# samt typekonvertering til heltal"; "Seaborn og Matplotlib til at kortlægge prisforskelle på
# tværs af værelsestyper, evaluere afbestillingsreglers indflydelse på lejepriser via boxplots,
# samt identificere bookningsmønstre på tværs af bydele")
# Claim audit 2026-10-12 (CLAUDE.md, rule 1): every step, number and library was OWNER-PDF only; hidden until the IBM Data
# Analytics notebook is in _kilder/.
method:
  en: "TODO: the analysis steps — from the IBM Data Analytics notebook"
  da: "TODO: analysens trin — fra IBM Data Analytics-notebooken"
technology: []
result:
  en: "Completed as the final capstone project of the IBM Data Analytics certificate."
  da: "Gennemført som afsluttende capstone-projekt i IBM Data Analytics-certificeringen."
# Order and featured: presentation only (Projects section, 2026-10-11, set by the lead's brief).
featured: false
order: 7
---
