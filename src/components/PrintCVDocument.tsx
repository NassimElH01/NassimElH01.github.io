import React from "react";
import { cvItems } from "@/data/cvData";
import { skillCategories } from "./SkillsSection";
import { projectsData } from "@/data/projectsData";

export default function PrintCVDocument() {
  const uddannelser = cvItems.filter((item) => item.category === "uddannelse");
  const erhverv = cvItems.filter((item) => item.category === "it" || item.category === "omsorg");

  return (
    <div className="bg-white text-slate-900 font-sans p-6 text-[9.5pt] leading-relaxed max-w-[210mm] mx-auto print:p-0 print:max-w-none print:text-[9pt]">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex justify-between items-baseline">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 font-serif">
            Nassim Hassani
          </h1>
          <span className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
            Curriculum Vitae
          </span>
        </div>
        
        <p className="text-sm font-semibold text-slate-800 mt-1">
          Digital transformation MSc student • PMO / Data & AI / Business-Technology bridge
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[8.5pt] text-slate-600 font-medium">
          <span>Copenhagen</span>
          <span>•</span>
          <span>+45 24 77 07 84</span>
          <span>•</span>
          <span>naselh01@gmail.com</span>
          <span>•</span>
          <span>linkedin.com/in/nassim-hassani-63835a220</span>
          <span>•</span>
          <span>github.com/NassimElH01</span>
        </div>
      </header>

      {/* Profil Resumé */}
      <section className="mb-4">
        <h2 className="text-[10pt] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-1.5">
          Profil & Fagligt Fokus
        </h2>
        <p className="text-[9pt] text-slate-800 text-justify leading-relaxed">
          Digital transformation student and project-oriented professional with a business-technology profile spanning PMO, data analysis, Power BI, AI/digitalisation, and process improvement. Experienced in cross-functional project support, stakeholder coordination, governance, and reporting. Brings strong communication skills, analytical thinking, and an ability to connect strategic digital initiatives to operational execution.
        </p>
      </section>

      {/* Faglige Nøglekompetencer & IT-Uddannelse - Placering øverst for maksimal synlighed */}
      <section className="mb-4 break-inside-avoid">
        <h2 className="text-[10pt] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
          Faglige Nøglekompetencer & IT-Uddannelse
        </h2>

        {/* Akademisk IT-Fundament under IT-kompetencer */}
        <div className="mb-2 bg-slate-100/90 px-2.5 py-1.5 rounded border border-slate-200 text-[8.5pt]">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-bold text-slate-950">Kandidatuddannelse (Kand.):</span>{" "}
              <span className="text-slate-800 font-medium">Digital Transformation</span>{" "}
              <span className="text-slate-500 font-mono text-[7.5pt]">(RUC, 2026 - Nu)</span>
            </div>
            <div>
              <span className="font-bold text-slate-950">Bacheloruddannelse (BSc):</span>{" "}
              <span className="text-slate-800 font-medium">Informatik & Virksomhedsstudier</span>{" "}
              <span className="text-slate-500 font-mono text-[7.5pt]">(RUC, 2021 - 2024)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[8.5pt]">
          {skillCategories.map((cat) => (
            <div key={cat.title} className="bg-slate-50 p-2 rounded border border-slate-200">
              <p className="font-bold text-slate-900 text-[8.5pt] mb-0.5">
                {cat.title}
              </p>
              <p className="text-slate-700 leading-snug">
                {cat.skills.join(", ")}.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Erhvervserfaring */}
      <section className="mb-4">
        <h2 className="text-[10pt] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2.5">
          Erhvervserfaring
        </h2>
        
        <div className="space-y-3">
          {erhverv.map((item) => (
            <article 
              key={item.id} 
              className="break-inside-avoid border-b border-slate-200/70 pb-2.5 last:border-b-0"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-slate-950 text-[10pt]">
                  {item.title}
                </h3>
                <span className="text-[8.5pt] font-semibold text-slate-600 font-mono">
                  {item.period}
                </span>
              </div>
              
              <div className="text-[8.5pt] font-semibold text-slate-700 mb-1">
                {item.organization}
              </div>
              
              <p className="text-[8.5pt] text-slate-800 leading-snug mb-1">
                {item.description}
              </p>

              {item.bullets && item.bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-slate-700">
                  {item.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
              {item.personalCompetencies && item.personalCompetencies.length > 0 && (
                <p className="text-[8pt] text-slate-700 leading-snug mt-1">
                  <strong>Personlige kompetencer:</strong>{" "}
                  {item.personalCompetencies.join(" · ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Uddannelse */}
      <section className="mb-4 break-inside-avoid">
        <h2 className="text-[10pt] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2.5">
          Uddannelse
        </h2>

        <div className="space-y-2.5">
          {uddannelser.map((edu) => (
            <article 
              key={edu.id} 
              className="break-inside-avoid border-b border-slate-200/70 pb-2 last:border-b-0"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-slate-950 text-[10pt]">
                  {edu.title}
                </h3>
                <span className="text-[8.5pt] font-semibold text-slate-600 font-mono">
                  {edu.period}
                </span>
              </div>
              
              <div className="text-[8.5pt] font-semibold text-slate-700 mb-1">
                {edu.organization}
              </div>

              <p className="text-[8.5pt] text-slate-800 leading-snug mb-1">
                {edu.description}
              </p>

              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-slate-700">
                  {edu.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Udvalgte Projekter - Strømlinet med mindre tekst */}
      <section className="mb-4 break-inside-avoid">
        <h2 className="text-[10pt] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
          Udvalgte Projekter & Tekniske Showcases
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {projectsData.slice(0, 4).map((proj) => (
            <article 
              key={proj.id} 
              className="break-inside-avoid pb-1 border-b border-slate-100"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-slate-900 text-[8.5pt] truncate max-w-[190px]">
                  {proj.shortTitle || proj.title}
                </h3>
                <span className="text-[7pt] text-slate-500 font-medium">
                  {proj.category.split(" ")[0]}
                </span>
              </div>

              <p className="text-[8pt] text-slate-700 leading-tight mt-0.5 line-clamp-2">
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1 mt-1">
                {proj.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[6.5pt] bg-slate-100 text-slate-600 font-mono px-1 py-0.2 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Referencer */}
      <footer className="pt-2.5 border-t border-slate-300 text-[8pt] text-slate-600 flex justify-between items-center break-inside-avoid">
        <p>
          <strong>Referencer:</strong> Oplyses gerne ved henvendelse.
        </p>
      </footer>
    </div>
  );
}
