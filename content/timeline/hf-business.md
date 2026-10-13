---
# Sources: OWNER-PDF, the owner's 18-page text pack ("Her er en komplet ... tekstpakke",
# shared 2026-10-11; written with an AI assistant, so used for facts only; PDF page
# numbers), section 5 "Uddannelse & Eksamensresultater" (p.15), and the owner's answers
# of 2026-10-11 (answer 1: "Dem alle 3 ( Vidergående, gymnaisum & folkeskole )", so HF
# grades may be shown). No earlier source mentions HF. English is a faithful
# translation for the owner to review.
# Left out on purpose: the PDF's "dimitterede blandt de absolut højeste
# karaktergennemsnit på årgangen" (also p.1: "et af årgangens højeste
# karaktergennemsnit"); the owner has not documented it.
# Source: OWNER-PDF p.15 ("HF-Eksamen (Business-linjen)")
kind: "education"
# Source: OWNER-PDF p.15 ("HF-Eksamen (Business-linjen)"). "Higher Preparatory
# Examination" is the usual English name for HF.
title:
  en: "Higher Preparatory Examination (HF), business line"
  da: "HF-eksamen, Business-linjen"
# Claim audit 2026-10-12 (CLAUDE.md, rule 1): the school and the years were OWNER-PDF only; they wait for the HF-bevis in
# _kilder/. <facts> gives "HF Business" and the average without dates, so the entry is undated.
organization: "TODO: school — from the HF-bevis"
undated: true
# Source: OWNER-PDF p.15 (HF on the business line, 2019 – 2021)
summary:
  en: "Upper secondary education (HF) on the business line."
  da: "Gymnasial uddannelse (HF) på Business-linjen."
# Source: OWNER-PDF p.15, in the PDF's order. The PDF calls the subjects "Hovedfag";
# they are listed as given, not as a complete list. Grades are on the Danish 7-point
# scale (-3 to 12).
# The owner checked these grades against his diplomas (owner 2026-10-11, second round).
grades:
  # Source: OWNER-PDF p.15 ("Eksamensresultat på 9,2"); also p.1 ("(9,2)"). The
  # eksamensresultat is the diploma's grade average. `grade` is one plain string for
  # both languages, so it keeps the source's Danish decimal comma ("9,2"), like
  # certification results, which are kept in the source's own terms.
  - label:
      en: "Overall exam result (grade average)"
      da: "Eksamensresultat (karaktergennemsnit)"
    grade: "9,2"
  # Source: OWNER-PDF p.15 ("Engelsk B mundtlig (12)")
  - label:
      en: "English B, oral"
      da: "Engelsk B, mundtlig"
    grade: "12"
  # Source: OWNER-PDF p.15 ("Engelsk B skriftlig (10)")
  - label:
      en: "English B, written"
      da: "Engelsk B, skriftlig"
    grade: "10"
  # Source: OWNER-PDF p.15 ("Matematik B mundtlig (10)")
  - label:
      en: "Mathematics B, oral"
      da: "Matematik B, mundtlig"
    grade: "10"
  # Source: OWNER-PDF p.15 ("Biologi C (12)")
  - label:
      en: "Biology C"
      da: "Biologi C"
    grade: "12"
  # Source: OWNER-PDF p.15 ("Erhvervsøkonomi C (12)")
  - label:
      en: "Business economics C"
      da: "Erhvervsøkonomi C"
    grade: "12"
  # Source: OWNER-PDF p.15 ("Samfundsfag B (10)")
  - label:
      en: "Social studies B"
      da: "Samfundsfag B"
    grade: "10"
  # Source: GEMINI-PDF p.10 ("Religion C (10)"), confirmed by the owner 2026-10-13
  - label:
      en: "Religious studies C"
      da: "Religion C"
    grade: "10"
  # Source: GEMINI-PDF p.10 ("Større skriftlig opgave i Engelsk (10)"), confirmed by the owner
  # 2026-10-13
  - label:
      en: "Extended written assignment in English"
      da: "Større skriftlig opgave i engelsk"
    grade: "10"
# Presentation choice from the lead's brief, not a sourced fact.
showOnPrintCv: true
# After the PBA (order 2); About sorts education by start year anyway.
order: 11
---
