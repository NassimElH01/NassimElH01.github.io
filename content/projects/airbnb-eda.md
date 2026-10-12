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
  en: "Exploratory data analysis of Airbnb bookings (IBM capstone)"
  da: "Eksplorativ dataanalyse af Airbnb-bookinger (IBM-capstone)"
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
  en: "Analyse a dataset of more than 100,000 Airbnb booking records from New York City."
  da: "At analysere et datasæt med over 100.000 registreringer af Airbnb-bookinger i New York City."
# Source: OWNER-PDF p.9 ("Afsluttende Skriftligt Projekt") and p.16 (the final capstone of the IBM
# certificate course); owner 2026-10-11 (the Airbnb analysis is his IBM data analytics capstone).
# Not called "individual": no source says so (owner to confirm). The PDF's name "IBM Data Analyst
# Professional Certificate" is not used; CLAUDE.md, the CVs and LinkedIn say "IBM Data Analytics"
# (see the conflict note above).
role:
  en: "Capstone project: the final written project of IBM's data analytics certificate course."
  da: "Capstone-projekt: det afsluttende skriftlige projekt i IBM's certificeringsforløb i dataanalyse."
# Source: OWNER-PDF p.10 ("Data Loading og strukturanalyse via Pandas og NumPy"; "Frasortering af
# irrelevante kolonner, eliminering af over 3.400 duplikerede rækker samt systematisk imputation
# af manglende værdier (mode for kategoriske data, median for numeriske data)"; "Normalisering af
# kolonnenavne (snake_case), fjernelse af valutasymboler og kommaer via custom lambda-funktioner
# samt typekonvertering til heltal"; "Seaborn og Matplotlib til at kortlægge prisforskelle på
# tværs af værelsestyper, evaluere afbestillingsreglers indflydelse på lejepriser via boxplots,
# samt identificere bookningsmønstre på tværs af bydele")
method:
  en: "Loaded the data and analysed its structure with pandas and NumPy. Cleaned it by dropping irrelevant columns, removing more than 3,400 duplicate rows and filling in missing values (the mode for categorical data, the median for numerical data). Renamed the columns to snake_case, stripped currency symbols and commas with custom lambda functions and converted the values to integers. Used Seaborn and Matplotlib to map price differences across room types, examine with boxplots how cancellation policies relate to rental prices, and identify booking patterns across the city's boroughs."
  da: "Indlæste data og analyserede strukturen med pandas og NumPy. Rensede data ved at fjerne irrelevante kolonner og over 3.400 dublerede rækker og udfylde manglende værdier (typetallet for kategoriske data, medianen for numeriske data). Omdøbte kolonnerne til snake_case, fjernede valutasymboler og kommaer med egne lambda-funktioner og konverterede værdierne til heltal. Brugte Seaborn og Matplotlib til at kortlægge prisforskelle på tværs af værelsestyper, undersøge med boxplots, hvordan afbestillingsreglerne hænger sammen med lejepriserne, og finde bookingmønstre på tværs af byens bydele."
# Source: OWNER-PDF p.10 (pandas, NumPy, Seaborn, Matplotlib, lambda functions: Python libraries
# and Python code) and p.16 (Kompetencer: "Pandas, NumPy, ... Matplotlib/Seaborn")
technology:
  - "Python"
  - "pandas"
  - "NumPy"
  - "Matplotlib"
  - "Seaborn"
# Source: CLAUDE.md <facts> (IBM-certifikater, 2026-10-12: "Gennemført, inkl. afsluttende
# capstone-projekt") and owner 2026-10-11 (this analysis is the IBM Data Analytics capstone). No
# grade: no document in _kilder/ shows one (the owner's "Ja, også fuld score" is not a document).
result:
  en: "Completed as the final capstone project of the IBM Data Analytics certificate."
  da: "Gennemført som afsluttende capstone-projekt i IBM Data Analytics-certificeringen."
# Order and featured: presentation only (Projects section, 2026-10-11, set by the lead's brief).
featured: false
order: 7
---
