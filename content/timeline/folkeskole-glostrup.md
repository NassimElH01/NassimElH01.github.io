---
# Sources: OWNER-PDF, the owner's 18-page text pack ("Her er en komplet ... tekstpakke",
# shared 2026-10-11; written with an AI assistant, so used for facts only; PDF page
# numbers), section 5 "Uddannelse & Eksamensresultater" (p.15-16), and the owner's
# answers of 2026-10-11 (answer 1: "Dem alle 3 ( Vidergående, gymnaisum & folkeskole )",
# so folkeskole grades may be shown). No earlier source mentions it. English is a
# faithful translation for the owner to review.
# Left out on purpose: the PDF's "Stærkt tidligt analytisk fundament" (p.16), which is
# phrasing, not a fact.
# Source: OWNER-PDF p.15 ("Folkeskolens Afgangsprøve (9. klasse)")
kind: "education"
# Source: OWNER-PDF p.15 ("Folkeskolens Afgangsprøve (9. klasse)")
title:
  en: "Lower secondary school leaving examination (9th grade)"
  da: "Folkeskolens afgangsprøve (9. klasse)"
# Source: OWNER-PDF p.16 ("Glostrup Skole, Vestervang")
organization: "Glostrup Skole, Vestervang"
# Source: OWNER-PDF p.16 ("Afsluttet 2017"). Only the completion year is known, so the
# entry is dated as the exam itself: start and end are both 2017.
start: "2017"
end: "2017"
# Source: OWNER-PDF p.16 ("Afsluttet 2017")
summary:
  en: "Completed lower secondary school (folkeskole) with the leaving examination in 2017."
  da: "Afsluttede folkeskolen med afgangsprøven i 2017."
# Source: OWNER-PDF p.16, in the PDF's order. Grades are on the Danish 7-point scale
# (-3 to 12).
# TODO (owner): OWNER-PDF p.16 also says "samt karakteren 12 i begge skriftlige
# eksamener" without naming the two exams. Both mathematics exams below are written and
# graded 10, so the line cannot be placed without a guess. (The "12 i de skriftlige
# eksamener" on p.1 is about the IBM certificates, not this school.) It is kept out of
# `grades` because About shows every grade label as it is, so a "TODO:" label would
# appear on the page; add the two exams here, each graded 12, once the owner names them.
grades:
  # Source: OWNER-PDF p.16 ("Matematik med hjælpemidler (10)")
  - label:
      en: "Mathematics, with aids"
      da: "Matematik med hjælpemidler"
    grade: "10"
  # Source: OWNER-PDF p.16 ("Matematik uden hjælpemidler (10)")
  - label:
      en: "Mathematics, without aids"
      da: "Matematik uden hjælpemidler"
    grade: "10"
  # Source: OWNER-PDF p.16 ("Fysik/Kemi/Biologi/Geografi (10)")
  - label:
      en: "Physics/chemistry/biology/geography"
      da: "Fysik/kemi/biologi/geografi"
    grade: "10"
  # Source: OWNER-PDF p.16 ("Historie (10)")
  - label:
      en: "History"
      da: "Historie"
    grade: "10"
  # Source: OWNER-PDF p.16 ("Engelsk mundtlig (12)")
  - label:
      en: "English, oral"
      da: "Engelsk, mundtlig"
    grade: "12"
# Presentation choice, not a sourced fact: a lower secondary school exam is usually left
# off a graduate's CV, so it stays on the site only. Owner: set true to print it.
showOnPrintCv: false
# After the HF (order 11); About sorts education by start year anyway.
order: 12
---
