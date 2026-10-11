---
# Sources: the owner's answers of 2026-10-11 (he pasted IBM's evaluation of his IBM Cybersecurity
# Analyst capstone: project title, date of evaluation, the five tasks, the rubric and the grade)
# and OWNER-PDF, the owner's 18-page text pack ("Her er en komplet ... tekstpakke", shared
# 2026-10-11; written with an AI assistant, so used for facts only, never as copy; PDF page
# numbers), p.6-7 (IT-Sikkerhed), p.10-11 ("IBM Cybersecurity Project") and p.16 ("IBM
# Cybersecurity Analyst Professional Certificate | IBM SkillsBuild"). The evaluation wins.
# Not published on purpose: the evaluator's name, the IP addresses, the SQL payload, the wordlist
# name and the names of the test sites in the PDF (p.10-11).
# CONFLICT: the PDF says "Karakteren 12" (p.10 and p.16); the evaluation says "Grade: A", 50/50,
# and the owner chose "Grade A, fuld score" (2026-10-11). The evaluation and the owner win.
# CONFLICT (date): content/certifications.yaml dates IBM Cybersecurity October 2023 (LinkedIn);
# this capstone was evaluated on 2 January 2024. Owner to confirm whether the capstone belongs to
# that certificate or to a later "Professional Certificate" (PDF p.16).
# Left out, unconfirmed: SQL injection countermeasures. The PDF says they were "implemented"
# (p.7) and "documented" (p.11), and the evaluation's task list does not mention them.
# Source: owner 2026-10-11 (project title: "assess your proficiency in utilizing popular
# cybersecurity analysis tools, including Wireshark, Kali Linux, and ZAP")
title:
  en: "Cybersecurity lab: Wireshark, Kali Linux and ZAP (IBM capstone)"
  da: "Cybersikkerhedslab: Wireshark, Kali Linux og ZAP (IBM-capstone)"
# Source: owner 2026-10-11 (date of evaluation: 2 January 2024)
year: 2024
# Source: OWNER-PDF p.16 (a capstone in an IBM professional certificate course, not the PBA).
# "study" is the closest context in the enum.
context: "study"
# Source: owner 2026-10-11 (the evaluation's project title, quoted above; five tasks)
problem:
  en: "Assess his own proficiency with popular cybersecurity analysis tools, including Wireshark, Kali Linux and ZAP, through five practical tasks."
  da: "At vurdere sine egne færdigheder i udbredte værktøjer til cybersikkerhedsanalyse, bl.a. Wireshark, Kali Linux og ZAP, gennem fem praktiske opgaver."
# Source: owner 2026-10-11 (IBM's evaluation of his capstone; its remark says he carried out all
# the tasks); OWNER-PDF p.10 ("Afsluttende Skriftligt Projekt"). The PDF's certificate name (p.16,
# "IBM Cybersecurity Analyst Professional Certificate") is not used; CLAUDE.md, the CVs and
# LinkedIn say "IBM Cybersecurity" (see the date conflict above).
role:
  en: "Individual capstone project in IBM's cybersecurity certificate course: Nassim carried out all five tasks."
  da: "Individuelt capstone-projekt i IBM's certificeringsforløb i cybersikkerhed: Nassim løste alle fem opgaver."
# Source: owner 2026-10-11 (the five tasks: (1) network traffic analysis in Wireshark with filters,
# filter buttons and colouring a conversation; (2) VoIP security analysis: common VoIP problems,
# number of SIP endpoints and calls, playing audio streams, SIP call flow; (3) password cracking
# with Hashcat (wordlist + built-in rules) and John the Ripper (different modes), analysing
# password strength; (4) manual SQL injection on a test banking website: exploring with admin
# credentials, a transfer between accounts, identifying SQL injection vulnerabilities; (5)
# pen-tests on a website with ZAP: automated scan with the traditional spider, the Ajax spider,
# explored pages). OWNER-PDF p.7 (Hashcat and John the Ripper "i Kali Linux"; ZAP "på
# testplatforme") and p.11 (ZAP on a test web application).
method:
  en: "Five practical tasks. Analysed network traffic in Wireshark with filters, filter buttons and colour-coding of a conversation. Analysed VoIP traffic: common VoIP problems, the number of SIP endpoints and calls, the SIP call flow and the calls' audio streams. Cracked password hashes in Kali Linux with Hashcat (a wordlist and built-in rules) and John the Ripper (different modes) and assessed how strong the passwords were. Carried out manual SQL injection on a test banking website, exploring it with admin access, making a transfer between accounts and identifying its SQL injection vulnerabilities. Ran automated penetration tests on a test website with ZAP, using both the traditional spider and the Ajax spider."
  da: "Fem praktiske opgaver. Analyserede netværkstrafik i Wireshark med filtre, filterknapper og farvekodning af en samtale. Analyserede VoIP-trafik: typiske VoIP-problemer, antallet af SIP-endpoints og opkald, SIP-opkaldsforløbet og opkaldenes lydstreams. Knækkede password-hashes i Kali Linux med Hashcat (en ordliste og indbyggede regler) og John the Ripper (forskellige tilstande) og vurderede, hvor stærke adgangskoderne var. Udførte manuel SQL-injection på en test-netbank, hvor han undersøgte siden med administratoradgang, lavede en overførsel mellem konti og fandt dens SQL-injection-sårbarheder. Kørte automatiske penetrationstests på en testside med ZAP med både den traditionelle spider og Ajax-spideren."
# Source: owner 2026-10-11 (the project title and the five tasks); OWNER-PDF p.7 and p.16
# ("OWASP ZAP")
technology:
  - "Wireshark"
  - "Kali Linux"
  - "Hashcat"
  - "John the Ripper"
  - "OWASP ZAP"
  - "SQL injection"
# Source: owner 2026-10-11 (the evaluation: rubric 6+6+8+8+8+8+6 = 50/50, "Grade: A"; the owner
# chose "Grade A, fuld score")
result:
  en: "Graded A with a full score (50/50) in IBM's assessment."
  da: "Fik Grade A med fuld score (50/50) i IBM's bedømmelse."
# Order and featured: presentation only (Projects section, 2026-10-11, set by the lead's brief).
featured: false
order: 6
---
