import { useState, type KeyboardEvent } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  Dumbbell,
  HeartPulse,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { Language } from "@/lib/translations";

type DemoTab = "training" | "recovery" | "nutrition" | "progress";

interface SCTDemoProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const copy = {
  da: {
    demo: "Interaktiv produktdemo · Kun syntetiske data",
    title: "Træn med overblik.",
    subtitle: "Strength & Conditioning Tracking samler træning, restitution, ernæring og fremgang ét sted — så du kan tage informerede valg over tid.",
    portfolio: "Tilbage til portfolio",
    source: "Se kildekode",
    today: "Dagens overblik",
    sample: "Eksempelprofil · ingen personlige data",
    tabs: { training: "Træning", recovery: "Restitution", nutrition: "Ernæring", progress: "Fremgang" },
    trainingTitle: "Dagens træningspas",
    trainingSub: "Styrke · Underkrop · 45 min",
    sets: "Gennemførte sæt",
    exercise: "Øvelse",
    volume: "Træningsvolumen",
    exercises: [["Squat", "3 × 8"], ["Rumænsk dødløft", "3 × 10"], ["Split squat", "3 × 8 / side"]],
    recoveryTitle: "Klarhed før belastning",
    recoverySub: "Et samlet billede af søvn, energi og oplevet restitution — ikke en diagnose.",
    readiness: "Readiness (eksempel)",
    sleep: "Søvn",
    energy: "Energi",
    soreness: "Muskelømhed",
    good: "God",
    moderate: "Moderat",
    nutritionTitle: "Ernæring i balance",
    nutritionSub: "Eksempeldag · vejledende mål kan tilpasses individuelt",
    calories: "Energi",
    protein: "Protein",
    carbs: "Kulhydrat",
    fats: "Fedt",
    progressTitle: "Små skridt, synlig fremgang",
    progressSub: "Eksempel på ugentlig træningsmængde. Fokusér på udvikling over tid frem for enkelte målinger.",
    thisWeek: "Denne uge",
    sessions: "træningspas",
    volumeTrend: "Volumenudvikling",
    trendCaption: "Stabil fremgang over de seneste 4 uger",
    safety: "Demoen bruger udelukkende opdigtede eksempeldata. SCT er et træningsværktøj — ikke medicinsk rådgivning. Tilpas træningen til din situation, og søg faglig hjælp ved behov.",
    modules: "Træning, restitution, ernæring og fremgang — samlet i SCT",
  },
  en: {
    demo: "Interactive product demo · Synthetic data only",
    title: "Train with clarity.",
    subtitle: "Strength & Conditioning Tracking brings training, recovery, nutrition, and progress together — helping you make informed choices over time.",
    portfolio: "Back to portfolio",
    source: "View source code",
    today: "Today's overview",
    sample: "Sample profile · no personal data",
    tabs: { training: "Training", recovery: "Recovery", nutrition: "Nutrition", progress: "Progress" },
    trainingTitle: "Today's training session",
    trainingSub: "Strength · Lower body · 45 min",
    sets: "Sets completed",
    exercise: "Exercise",
    volume: "Training volume",
    exercises: [["Squat", "3 × 8"], ["Romanian deadlift", "3 × 10"], ["Split squat", "3 × 8 / side"]],
    recoveryTitle: "Check in before loading",
    recoverySub: "A combined view of sleep, energy, and perceived recovery — not a diagnosis.",
    readiness: "Readiness (sample)",
    sleep: "Sleep",
    energy: "Energy",
    soreness: "Muscle soreness",
    good: "Good",
    moderate: "Moderate",
    nutritionTitle: "Nutrition in balance",
    nutritionSub: "Sample day · example targets can be adapted to the individual",
    calories: "Energy",
    protein: "Protein",
    carbs: "Carbohydrates",
    fats: "Fat",
    progressTitle: "Small steps, visible progress",
    progressSub: "Example of weekly training volume. Look at trends over time rather than isolated measurements.",
    thisWeek: "This week",
    sessions: "training sessions",
    volumeTrend: "Volume trend",
    trendCaption: "Steady progress over the last 4 weeks",
    safety: "This demo uses fictional sample data only. SCT is a training tool, not medical advice. Adapt training to your circumstances and seek professional guidance when needed.",
    modules: "Training, recovery, nutrition, and progress — together in SCT",
  },
} as const;

const tabIcons = {
  training: Dumbbell,
  recovery: HeartPulse,
  nutrition: Leaf,
  progress: BarChart3,
};

export default function SCTDemo({ language, onLanguageChange }: SCTDemoProps) {
  const [activeTab, setActiveTab] = useState<DemoTab>("training");
  const t = copy[language];
  const demoTabs = Object.keys(t.tabs) as DemoTab[];

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = demoTabs.indexOf(activeTab);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % demoTabs.length
        : event.key === "ArrowLeft"
          ? (currentIndex - 1 + demoTabs.length) % demoTabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? demoTabs.length - 1
              : -1;

    if (nextIndex >= 0) {
      event.preventDefault();
      const nextTab = demoTabs[nextIndex];
      setActiveTab(nextTab);
      document.getElementById(`sct-tab-${nextTab}`)?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide" aria-label="SCT — portfolio home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-300 text-slate-950"><Activity size={20} /></span>
            <span>SCT<span className="text-lime-300">.</span></span>
          </a>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1" aria-label={language === "da" ? "Vælg sprog" : "Choose language"}>
              {(["da", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onLanguageChange(option)}
                  aria-pressed={language === option}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors ${language === option ? "bg-lime-300 text-slate-950" : "text-slate-300 hover:text-white"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <a href="https://github.com/NassimElH01/Strength-Conditioning-Tracking-SCT-" target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-sm text-slate-300 hover:text-lime-200 sm:flex">
              {t.source}<ArrowUpRight size={15} />
            </a>
          </div>
        </header>

        <section className="grid gap-10 pb-10 pt-12 md:grid-cols-[1.1fr_.9fr] md:items-center md:pb-14 md:pt-16">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-xs font-medium text-lime-200">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />{t.demo}
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{t.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/?tab=projects" className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-lime-200">
                <ArrowLeft size={16} />{t.portfolio}
              </a>
              <a href="https://github.com/NassimElH01/Strength-Conditioning-Tracking-SCT-" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5 sm:hidden">
                {t.source}<ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-2xl shadow-lime-950/20 sm:p-7">
            <div className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-2xl bg-lime-300 text-slate-950 shadow-lg"><Activity /></div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-lime-200">{t.today}</p>
                <p className="mt-1 text-xl font-bold">SCT <span className="text-slate-400">/ 01</span></p>
              </div>
              <CalendarDays className="text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["03", t.tabs.training], ["82", t.readiness], ["72%", t.tabs.nutrition], ["+12%", t.tabs.progress]].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Check size={14} className="text-lime-300" />{t.sample}</p>
          </div>
        </section>

        <section aria-label={t.modules} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">
          <div className="border-b border-white/10 p-4 sm:p-6">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.modules}>
              {demoTabs.map((tab) => {
                const Icon = tabIcons[tab];
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    id={`sct-tab-${tab}`}
                    aria-selected={activeTab === tab}
                    aria-controls="sct-tab-panel"
                    tabIndex={activeTab === tab ? 0 : -1}
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={handleTabKeyDown}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 sm:px-4 ${activeTab === tab ? "bg-lime-300 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Icon size={16} />{t.tabs[tab]}
                  </button>
                );
              })}
            </div>
          </div>
          <div id="sct-tab-panel" role="tabpanel" aria-labelledby={`sct-tab-${activeTab}`} className="grid gap-8 p-5 sm:p-7 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{activeTab === "training" ? t.trainingTitle : activeTab === "recovery" ? t.recoveryTitle : activeTab === "nutrition" ? t.nutritionTitle : t.progressTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{activeTab === "training" ? t.trainingSub : activeTab === "recovery" ? t.recoverySub : activeTab === "nutrition" ? t.nutritionSub : t.progressSub}</p>
            </div>
            {activeTab === "training" && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-400"><span>{t.exercise}</span><span>{t.sets}</span></div>
                <div className="space-y-3">{t.exercises.map(([name, sets]) => <div key={name} className="flex items-center justify-between rounded-xl bg-white/[.04] px-4 py-3 text-sm"><span className="font-medium">{name}</span><span className="text-lime-200">{sets}</span></div>)}</div>
                <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-sm"><span className="text-slate-400">{t.volume}</span><span className="font-bold">4,280 kg</span></div>
              </div>
            )}
            {activeTab === "recovery" && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-end justify-between"><div><p className="text-sm text-slate-400">{t.readiness}</p><p className="mt-1 text-4xl font-bold text-lime-200">82<span className="text-lg text-slate-400">/100</span></p></div><HeartPulse className="mb-1 text-lime-300" size={30} /></div>
                <div className="mt-5 space-y-4">{[[t.sleep, "7.8 h", 78], [t.energy, t.good, 82], [t.soreness, t.moderate, 55]].map(([label, value, width]) => <div key={label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-400">{label}</span><span>{value}</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-lime-300" style={{ width: `${width}%` }} /></div></div>)}</div>
              </div>
            )}
            {activeTab === "nutrition" && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-end justify-between"><div><p className="text-sm text-slate-400">{t.calories}</p><p className="mt-1 text-3xl font-bold">1,840 <span className="text-sm font-medium text-slate-400">/ 2,400 kcal</span></p></div><Leaf className="text-lime-300" size={28} /></div>
                <div className="mt-5 space-y-4">{[[t.protein, "112 / 140 g", 80], [t.carbs, "198 / 260 g", 76], [t.fats, "58 / 75 g", 77]].map(([label, value, width]) => <div key={label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-400">{label}</span><span>{value}</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-lime-300" style={{ width: `${width}%` }} /></div></div>)}</div>
              </div>
            )}
            {activeTab === "progress" && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="flex items-end justify-between"><div><p className="text-sm text-slate-400">{t.thisWeek}</p><p className="mt-1 text-3xl font-bold">4 <span className="text-sm font-medium text-slate-400">{t.sessions}</span></p></div><span className="rounded-full bg-lime-300/10 px-3 py-1 text-sm font-bold text-lime-200">+12%</span></div>
                <div className="mt-5 flex h-32 items-end gap-3 border-b border-white/10 px-2">{[46, 66, 53, 78, 61, 90, 72].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-lime-500/50 to-lime-300" style={{ height: `${height}%` }} aria-label={`${t.volume} ${index + 1}`} />)}</div>
                <div className="mt-4 flex justify-between gap-3 text-xs text-slate-400"><span>{t.volumeTrend}</span><span>{t.trendCaption}</span></div>
              </div>
            )}
          </div>
        </section>

        <aside className="mt-6 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-4 text-sm leading-6 text-amber-100/90">
          <ShieldCheck className="mt-1 shrink-0 text-amber-200" size={19} />
          <p>{t.safety}</p>
        </aside>
        <footer className="py-8 text-center text-xs text-slate-500">SCT · Strength &amp; Conditioning Tracking · {t.demo}</footer>
      </div>
    </main>
  );
}
