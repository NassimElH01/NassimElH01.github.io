import React, { useState, useEffect } from "react";
import {
  Workflow,
  Cpu,
  Clock,
  TrendingUp,
  Coins,
  Users,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Zap,
  Building2,
  FileCheck,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProcessStep {
  id: string;
  name: string;
  asIs: {
    durationMin: number;
    errorRate: number;
    tool: string;
    description: string;
    painPoint: string;
  };
  toBe: {
    durationMin: number;
    errorRate: number;
    tool: string;
    description: string;
    benefit: string;
  };
}

const stepsData: ProcessStep[] = [
  {
    id: "intake",
    name: "1. Modtagelse & Triagering",
    asIs: {
      durationMin: 18,
      errorRate: 11.5,
      tool: "Delt mailboks & PDF-mapper",
      description: "Manuel åbning af e-mails, registrering i sagsbog og flytning af scannede bilag.",
      painPoint: "Høj risiko for oversete bilag og forsinket opstart på sager.",
    },
    toBe: {
      durationMin: 0.5,
      errorRate: 0.3,
      tool: "AI Document Classifier & OCR",
      description: "Automatisk klassificering af dokumenttyper og udtræk af metadata i realtid.",
      benefit: "Sager oprettes på < 30 sekunder med 99.7% nøjagtighed.",
    },
  },
  {
    id: "validation",
    name: "2. Register- & Identitetsopslag",
    asIs: {
      durationMin: 24,
      errorRate: 8.0,
      tool: "Legacy terminal & 3 portaler",
      description: "Sagsbehandler logger manuelt på CPR, CVR, RKI og NemKonto for kontrol.",
      painPoint: "Gentastningsfejl og ventetid mellem separate skærmbilleder.",
    },
    toBe: {
      durationMin: 1.0,
      errorRate: 0.1,
      tool: "API Integration Hub",
      description: "Synkrone API-kald henter og krydsvaliderer alle stamdata automatisk.",
      benefit: "Eliminering af manuelle gentastninger og 100% konsistente data.",
    },
  },
  {
    id: "assessment",
    name: "3. Risiko- & Kreditvurdering",
    asIs: {
      durationMin: 38,
      errorRate: 9.2,
      tool: "Excel-ark & manuelle formler",
      description: "Beregning af rådighedsbeløb og manuel vurdering ud fra statiske retningslinjer.",
      painPoint: "Inkonsistente afgørelser afhængigt af individuel sagsbehandler.",
    },
    toBe: {
      durationMin: 2.0,
      errorRate: 0.4,
      tool: "Rule Engine & Risk Score ML",
      description: "Automatisk kalkulation af betalingsevne og deterministisk risikoscoring.",
      benefit: "Ensartet kreditbeslutning med fuld revisionslog og transparens.",
    },
  },
  {
    id: "approval",
    name: "4. Afgørelse & 4-Øjne Godkendelse",
    asIs: {
      durationMin: 32,
      errorRate: 6.5,
      tool: "Manuel intern godkendelseskø",
      description: "Sagen sendes videre til en senior specialist for 4-øjne gennemgang.",
      painPoint: "Flaskehals: Sager ligger i gennemsnit 18-36 timer i intern kø.",
    },
    toBe: {
      durationMin: 1.5,
      errorRate: 0.2,
      tool: "Straight-Through Processing (STP)",
      description: "Lav- og mellemrisikosager godkendes automatisk. Kun afvigelser sendes til manuel audit.",
      benefit: "75-85% af sagerne passerer øjeblikkeligt uden menneskelig flaskehals.",
    },
  },
  {
    id: "dispatch",
    name: "5. Dokumentgenerering & Distribution",
    asIs: {
      durationMin: 16,
      errorRate: 5.0,
      tool: "Word brevskabeloner & Post",
      description: "Manuel fletning af brev, gemt som PDF og afsendt manuelt til e-Boks.",
      painPoint: "Tidskrævende skabelonvedligeholdelse og risiko for forkerte bilag.",
    },
    toBe: {
      durationMin: 0.5,
      errorRate: 0.1,
      tool: "MitID & Digital Post Gateway",
      description: "Automatisk samling af gældsbrev med MitID-signeringslink direkte til e-Boks.",
      benefit: "Kunde modtager aftale inden for 2 minutter med digital signatur.",
    },
  },
];

export const ProcessVisualizer: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<"compare" | "asis" | "tobe">("compare");
  const [selectedStepId, setSelectedStepId] = useState<string>("assessment");
  const [monthlyVolume, setMonthlyVolume] = useState<number>(3500);
  const [hourlyRate, setHourlyRate] = useState<number>(480);
  const [stpRate, setStpRate] = useState<number>(75);

  // Simulation animation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedCases, setSimulatedCases] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulatedCases((prev) => prev + 1);
        setActiveStepIndex((prev) => (prev + 1) % stepsData.length);
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  // Selected step data
  const activeStep = stepsData.find((s) => s.id === selectedStepId) || stepsData[2];

  // Mathematical ROI calculation
  const totalAsIsMin = stepsData.reduce((acc, s) => acc + s.asIs.durationMin, 0); // ~128 min
  // In To-Be, STP fraction takes To-Be time, non-STP fraction takes To-Be + small manual review (12 min)
  const baseToBeMin = stepsData.reduce((acc, s) => acc + s.toBe.durationMin, 0); // ~5.5 min
  const weightedToBeMin = (baseToBeMin * (stpRate / 100)) + ((baseToBeMin + 12) * ((100 - stpRate) / 100));

  const minutesSavedPerCase = totalAsIsMin - weightedToBeMin;
  const hoursSavedPerYear = Math.round((minutesSavedPerCase / 60) * (monthlyVolume * 12));
  const fteSaved = (hoursSavedPerYear / 1650).toFixed(1); // Standard Danish annual work hours ~ 1650
  const annualSavingsDKK = Math.round(hoursSavedPerYear * hourlyRate);

  // Error rate reduction
  const avgAsIsError = (stepsData.reduce((acc, s) => acc + s.asIs.errorRate, 0) / stepsData.length).toFixed(1);
  const avgToBeError = (stepsData.reduce((acc, s) => acc + s.toBe.errorRate, 0) / stepsData.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header controls & mode toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
        <div>
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Workflow className="w-4 h-4 text-primary" /> Værdikæde- & Procesoptimering
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Arkitektonisk sammenligning af legacy sagsbehandling og moderne hændelsesdrevet automatisering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-background text-xs">
            <button
              onClick={() => setViewMode("compare")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "compare" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sammenlign
            </button>
            <button
              onClick={() => setViewMode("asis")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "asis" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              As-Is (Manuel)
            </button>
            <button
              onClick={() => setViewMode("tobe")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "tobe" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              To-Be (STP AI)
            </button>
          </div>

          <Button
            size="sm"
            variant={isSimulating ? "destructive" : "default"}
            onClick={() => setIsSimulating(!isSimulating)}
            className="text-xs h-8 gap-1.5"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? "Stop Simulation" : "Kør Live Flow"}
          </Button>
        </div>
      </div>

      {/* KPI Impact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Årlig Besparelse</span>
            <Coins className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {(annualSavingsDKK / 1000000).toFixed(2)}M DKK
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ved {monthlyVolume.toLocaleString("da-DK")} sager/md
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Frigjorte Årsværk</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {fteSaved} FTE
          </div>
          <div className="text-[11px] text-muted-foreground">
            {hoursSavedPerYear.toLocaleString("da-DK")} timer sparet/år
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Gennemløbstid</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {Math.round(weightedToBeMin)} min <span className="text-xs font-normal text-muted-foreground">vs. {totalAsIsMin} min</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            94% hurtigere eksekvering
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Fejlrate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {avgToBeError}% <span className="text-xs font-normal text-muted-foreground">fra {avgAsIsError}%</span>
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Automatiserede valideringsregler
          </div>
        </div>
      </div>

      {/* Process Pipeline Visualizer (Interactive nodes) */}
      <div className="p-5 rounded-xl bg-card border border-border/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> End-to-End Procesforløb
            {isSimulating && (
              <Badge variant="secondary" className="text-[10px] animate-pulse bg-emerald-500/15 text-emerald-600">
                Live flow aktiv: {simulatedCases} sager behandlet
              </Badge>
            )}
          </h4>
          <span className="text-xs text-muted-foreground">Klik på et trin for detaljer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stepsData.map((step, idx) => {
            const isSelected = step.id === selectedStepId;
            const isAnimated = isSimulating && activeStepIndex === idx;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                } ${isAnimated ? "ring-2 ring-emerald-500 bg-emerald-500/10" : ""}`}
              >
                {/* Step indicator bar */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-foreground truncate">{step.name.split(". ")[1]}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Trin {idx + 1}</span>
                </div>

                {/* Subcontent based on viewMode */}
                <div className="space-y-1.5 text-xs">
                  {(viewMode === "compare" || viewMode === "asis") && (
                    <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-[11px]">
                      <div className="flex justify-between font-medium text-rose-700 dark:text-rose-400">
                        <span>As-Is</span>
                        <span>{step.asIs.durationMin}m</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{step.asIs.tool}</p>
                    </div>
                  )}

                  {(viewMode === "compare" || viewMode === "tobe") && (
                    <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                      <div className="flex justify-between font-medium text-emerald-700 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> To-Be
                        </span>
                        <span>{step.toBe.durationMin}m</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{step.toBe.tool}</p>
                    </div>
                  )}
                </div>

                {/* Bottom status badge */}
                <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Fejl: {step.asIs.errorRate}% → {step.toBe.errorRate}%</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl bg-card border border-border/60 shadow-sm">
        <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> As-Is: Nuværende Manuel Proces
            </span>
            <Badge variant="outline" className="text-xs border-rose-500/30 text-rose-600">
              {activeStep.asIs.durationMin} min / sag
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-foreground">Værktøjer & Systemer:</div>
            <p className="text-muted-foreground font-mono">{activeStep.asIs.tool}</p>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-foreground">Fremgangsmåde:</div>
            <p className="text-muted-foreground leading-relaxed">{activeStep.asIs.description}</p>
          </div>

          <div className="p-2.5 rounded bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300 font-medium">
            <strong>Kritisk flaskehals:</strong> {activeStep.asIs.painPoint}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> To-Be: Digitaliseret & Automatiseret
            </span>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
              {activeStep.toBe.durationMin} min / sag
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-foreground">Løsningsarkitektur:</div>
            <p className="text-muted-foreground font-mono">{activeStep.toBe.tool}</p>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-foreground">Automatiseret Flow:</div>
            <p className="text-muted-foreground leading-relaxed">{activeStep.toBe.description}</p>
          </div>

          <div className="p-2.5 rounded bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            <strong>Forretningsgevinst:</strong> {activeStep.toBe.benefit}
          </div>
        </div>
      </div>

      {/* Simulation & Calculation Parameters (Sliders) */}
      <div className="p-5 rounded-xl bg-card border border-border/60 shadow-sm space-y-4">
        <h4 className="text-sm font-semibold text-foreground">
          Juster virksomhedens parametre & volumen
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Månedligt Sagsvolumen</label>
              <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                {monthlyVolume.toLocaleString("da-DK")} sager
              </span>
            </div>
            <Slider
              value={[monthlyVolume]}
              min={500}
              max={15000}
              step={250}
              onValueChange={(val) => setMonthlyVolume(val[0])}
            />
            <p className="text-[11px] text-muted-foreground">Typisk afdelingsstørrelse i bank/forsikring</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Sagsbehandler Timeløn (kostpris)</label>
              <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                {hourlyRate} DKK / time
              </span>
            </div>
            <Slider
              value={[hourlyRate]}
              min={300}
              max={850}
              step={25}
              onValueChange={(val) => setHourlyRate(val[0])}
            />
            <p className="text-[11px] text-muted-foreground">Inkl. pension, IT-arbejdsplads & overhead</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">STP Automationsgrad</label>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {stpRate}% fuldautomatisk
              </span>
            </div>
            <Slider
              value={[stpRate]}
              min={40}
              max={95}
              step={5}
              onValueChange={(val) => setStpRate(val[0])}
            />
            <p className="text-[11px] text-muted-foreground">Resterende {100 - stpRate}% går til manual exception handling</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessVisualizer;
