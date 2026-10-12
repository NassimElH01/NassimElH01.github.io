# Projekt: Nassim El Hassani – portfolio v2
Personligt portfolio på GitHub Pages (nassimelh01.github.io). Målgruppe: rekrutterere, tech leads og potentielle freelancekunder. Reaktionen vi går efter er "hvor er det her fedt" efterfulgt af "ham her har potentiale".

## Hvem er Nassim
- Visningsnavn på sitet: Nassim Hassani
- Cand.it. i Digital Transformation, RUC (2026–2028)
- PBA i Økonomi & IT, Zealand
- PMO-praktik hos Royal Unibrew (Power BI, Azure DevOps, IT/OT- og cybersikkerhedsprojekter), IT-support og webdesign
- Certificeringer: PRINCE2 Foundation & Practitioner, IBM Data Analytics, IBM Cybersecurity, McKinsey Forward, Agile Project Management
- Sprog: dansk, engelsk, arabisk, tysk (mellem)
- Profil: brobygger mellem forretning og teknologi, som både kan kode, styre projekter og forstå økonomien

## Tech-regler
- Statisk site, der kan hostes gratis på GitHub Pages. Ingen backend og ingen hemmelige API-nøgler i frontend.
- Stack: Astro + TypeScript + Tailwind. Interaktive "øer" må bruge React eller vanilla JS. Animationer med GSAP eller Motion, og 3D (hvis det giver mening) med Three.js.
- Lighthouse 100 i alle kategorier på mobil på `/` og `/da/` (regel 5 nedenfor). Første indhold synligt under 2 sek. Tunge demoer (spil, 3D) lazy-loades først ved klik.
- Respekter `prefers-reduced-motion`: alle animationer har en rolig fallback.
- WCAG AA, fuld tastaturnavigation, semantisk HTML.
- Tosproget (dansk/engelsk) med sprogskifter. Engelsk som standard.

## Indholdsregler (VIGTIGT)
- Opfind aldrig færdigheder, projekter, tal eller citater. Brug kun det, der står i denne fil eller i `content/`. Mangler noget, så indsæt en tydelig `TODO:` i stedet for at gætte.
- Brug ingen ophavsretsbeskyttede figurer, logoer eller spil-ROMs.
- Inspirationssider bruges til stemning og interaktionsmønstre. Kopier aldrig deres kode, tekst eller grafik.

## Arbejdsgang
Plan → godkendelse → byg én sektion ad gangen → kør `/review-design` → commit med en beskrivende besked.

<rules>
Ufravigelige (Nassim, 2026-10-12).

1. **Kun dokumenterede påstande.** Hver kompetence, hvert tal og hver karakter skal kunne spores til en kilde i `_kilder/` eller til en linje i `<facts>`. Står noget kun i `<pending>`, forbliver det skjult. Det blokerer ikke merge.
2. **Kilder er private.** `_kilder/` står i `.gitignore` og committes aldrig. Transskriptioner (Bilag B), interviewpersoners navne, OT-dokumenter og intern dokumentation fra Royal Unibrew citeres aldrig og publiceres aldrig.
3. **Fortrolighed for OT:** ingen lokationer, leverandører, værktøjer fra POC'en, NIS2-arbejde eller netværksarkitektur. Rollen beskrives som angivet i `<facts>`.
4. **Ingen telefonnummer, ingen TODO i produktion, første person, begge sprog opdateres samtidig.**
5. **Lighthouse må ikke falde under 100** på `/` og `/da/`, og alle tests skal være grønne før merge.
6. **CV-download:** sitet må kun linke til et CV, der overholder regel 1. (`public/Nassim-Hassani-CV.pdf` er Nassims eget CV med rettet bachelorlinje og uden telefonlinje; den AI-skrevne "Portefølje og CV"-PDF må aldrig linkes.)
7. Er en instruktion i konflikt med en anden, så sig det. Vælg ikke i det skjulte.
</rules>

<facts>
Nassims afklaringer (2026-10-12). De har forrang for alt andet, undtagen regel 1–3.

**Profil:** Lokation "Storkøbenhavn / Sjælland" (ingen Glostrup nogen steder). Kode-fokus: Python, SQL og JavaScript (p5.js). Ingen Java.

**Karakterer (PBA Økonomi & IT):** praktik 12, bachelorprojekt 10, videnskabsteori & projektmetode 10, Generativ AI & ML 10, Teknologi- & dataintegration 10. Webudvikling & personligt salg (4) vises ikke. Folkeskole vises ikke.

**HF Business:** gennemsnit 9,2. "Blandt årgangens højeste" vises kun, hvis `HF bevis.pdf` eller en anden kilde dokumenterer det.

**IBM-certifikater:** "Gennemført, inkl. afsluttende capstone-projekt". Ingen dansk karakter og ingen "højeste udmærkelse", medmindre certifikatet eller kilden viser en sådan betegnelse.

**Royal Unibrew:** Junior Project Manager / PMO Intern, januar–juni 2025.

**Bachelorprojekt:** "Udviklede og anbefalede et socioteknisk løsningsdesign med data stewardship og hybrid governance, baseret på empirisk analyse af Royal Unibrews projektportefølje." Et anbefalet design, ikke en implementering.

**Power BI Super User Guide:** "Intern brugervejledning og governance-standard, udarbejdet for PMO og Group IT under praktikopholdet." Ordet "officiel" bruges ikke.

**OT Cyber Security:** "Projektledelsessupport, use case-modellering, interessentstyring og backlog-opbygning i Azure DevOps." Ingen hands-on netværks- eller firewallarbejde.

**Tjekkit:** både et objektorienteret Python-program med MySQL-database og en serie mobile UI-mockups.

**Freelance:** landing pages og responsive websites i WordPress, HTML og CSS, inkl. hosting-opsætning og basal SEO. Eksempler: 24Support og S&S. (Afklaret 2026-10-12: S&S Rengøringsservice forbliver et job, IT-support og webdesigner, men nævnes som eksempel i freelance-kortet.)

**Kompetencer** (tekst må justeres til det kilden dokumenterer, aldrig opad):

| Kompetence | Kontekst | Tekst |
|---|---|---|
| Windows | IT-studentermedhjælper, Zealand 2025–26 | 1st- og 2nd-line support og fejlsøgning på Windows-klienter, netværksadgang og Microsoft 365. |
| GitHub | Dette site | Versionsstyring, branches og pull requests, deployment via GitHub Pages. |
| Supply chain | PBA 2. sem. (SCM), Boozt | Servicegrad, lageroptimering og automatiseret lager (AutoStore) analyseret i Boozt-casen. |
| Digitaliseringsstrategi | PBA 4. sem., RUC | Kobling mellem forretningsmål, enterprise-arkitektur og IT-understøttelse. |
| Bæredygtige forretningsmodeller | Boozt, RUC DTB | Bæredygtighed som merværdi i en forretningsmodel, ESG-felter i domænemodel og proces. |
| SDG / CSR | PBA 4. sem., Boozt | FN's verdensmål og ansvarlig produktion anvendt i casearbejde. |
| UX og usability-test | Systemudvikling, RUC DMT | Wireframes og mockups, usability-evaluering med Wizard of Oz. |
| HCI | RUC Designmetoder og Teknologier | Interaktive prototyper med fokus på kropslig interaktion og feedback. |
| Kravspecifikation | Tjekkit, Boozt, OT-projektet | Kravlister, use cases og user stories. |
| Kommunikationsplaner | PBA 1. og 4. sem., Royal Unibrew PMO | Kommunikations- og interessentplaner ved digitale forandringer. |
| Netværk & IT-infrastruktur (omdøbt) | PBA 3. sem., IBM Cybersecurity | Netværkstopologier, OSI-modellen og pakkeanalyse i Wireshark. |
| Agile metoder | Certificering i Agil Projektledelse (2024), Azure DevOps | Scrum og Kanban (Certificering i Agil Projektledelse, 2024); backlog med epics og features i Azure DevOps hos Royal Unibrew. (Afklaret 2026-10-12: ingen "sprintkadence", da praktikrapporten siger, at Royal Unibrew primært arbejdede efter vandfaldsmodellen; certifikatets eget navn er "Certificering", ikke "Diplom".) |

**Bevidst nedjusteret:** "SRS" (kravspecifikation), "A/B-test" (UX), "issue-tracking" (GitHub) og "operationalisering" (SDG), fordi ingen kilde endnu dokumenterer dem. Kildebelæg vises Nassim, før de tilføjes igen.

**Cases:**
- *Boozt.com:* BMC, PESTLE, Porters 5 Forces, VRIO. Spørgeskema (N = 59): pris 4,5, kvalitet 4,2, bæredygtighed 2,2, så bæredygtighed blev en merværdi via SAFE-modellen. Domænemodellens `item`-klasse udvidet med CO₂ og genbrugsprocent (nullable). BPMN med grønne valideringsporte før publicering. Køreplan år 0–3 efter Lewin. Alle tal verificeres mod PDF'en.
- *p5.js face tracking:* RUC, Designmetoder og Teknologier, workshop 2. JavaScript i p5.js Web Editor. Live webcam med face tracking (næseposition og ansigtsstørrelse) og real-time emotion classification, der udløser grafiske overlays, når en tærskel overskrides. Kontekst: temporal form og kropslig feedback.
</facts>

<pending>
Forbliver skjult, indtil Nassim svarer. Blokerer ikke merge.
1. **p5.js:** solo eller gruppe? Indtil da skrives "kursusprojekt" uden rolleangivelse.
2. **SCT vs. posture-checker:** SCT er "Strength & Conditioning Tracking" (Next.js); posture-checkeren er "Femtech 65+ Surveillance Mirror" (p5.js, ml5.js, MoveNet). De slås ikke sammen.
3. **Posture-checker:** problem og resultat mangler. Ny titel uden ordet "surveillance" (forslag afventer).
4. **Physical computing:** forbliver skjult. Webcam-input dokumenterer computer vision, ikke sensorer eller hardware; evidensen foreslås under "Computer vision".
5. **Matas-casen (4. semester):** forslag om den skal være en case afventer.
6. **Generativ AI & ML (10):** tekst ud fra eksamensopgaven afventer godkendelse.
</pending>

## Kilder (`_kilder/`, gitignored, kun lokalt i sessionen)
Boozt (3. sem.), 2. semester/Tjekkit (Coop 365), Matas (4. sem.), Teknologi- & dataintegration (5. sem.), Generativ AI & ML, bachelorprojektet med bilag C–E (kun til forståelse), praktikrapport og praktikjournal, Power BI Super User Guide, IBM Data Analytics-notebook, IBM Cybersecurity, p5.js-materialet (RUC), kravspecifikationsskabelon, Webudvikling & personligt salg (nævnes ikke), HF-bevis og studieordningen (Økonomi & IT 2022). Hver værdi i `content/` får en `# Source:`-kommentar, der peger på kilden eller på `<facts>`.
