import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileText,
  Scale,
  Search,
  Sparkles,
  Download,
  Check,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Shield,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Clause {
  id: string;
  section: string;
  title: string;
  riskLevel: "critical" | "warning" | "compliant";
  originalText: string;
  fixedText: string;
  legalCitation: string;
  legalRationale: string;
  isRemediated: boolean;
}

interface ContractDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  clauses: Clause[];
}

const presetDocuments: ContractDocument[] = [
  {
    id: "debt-agreement",
    title: "Standard Gældsbrev & Låneaftale",
    category: "Finansiering & Inkasso",
    description: "Kreditkontrakt med klausuler om morarenter, forældelsesfrister, rykkergebyrer og opsigelse.",
    clauses: [
      {
        id: "c1",
        section: "§ 4.2",
        title: "Forældelsesfrist for hovedstol og renter",
        riskLevel: "critical",
        originalText: "Skyldner accepterer hermed uigenkaldeligt, at forældelsesfristen for såvel hovedstol som alle tilskrevne renter og gebyrer forlænges til 20 år fra lånets misligholdelse.",
        fixedText: "Fordringen forældes efter de almindelige regler i forældelsesloven (3 år for renter og gebyrer jf. § 3, stk. 1, og 10 år for gældsbrevet jf. § 5, stk. 1, nr. 1). Aftaler om forudgående forlængelse af forældelsesfristen er ugyldige jf. lovens § 26, stk. 2.",
        legalCitation: "Forældelseslovens § 26, stk. 2 & § 3, stk. 1",
        legalRationale: "Forældelsesfrister kan ikke gyldigt fraviges til skade for skyldneren forud for forældelsens indtræden. En aftale om 20 års forældelse er derfor ugyldig som lovstridig.",
        isRemediated: false,
      },
      {
        id: "c2",
        section: "§ 6.1",
        title: "Oplysning om Årlige Omkostninger i Procent (ÅOP)",
        riskLevel: "critical",
        originalText: "Låntager er oplyst om, at der tilskrives en nominel debitorrente på 9,5% p.a. Øvrige etableringsomkostninger opgøres særskilt ved udbetaling uden særskilt ÅOP-beregning.",
        fixedText: "Kreditaftalen indeholder behørig oplysning om lånets samlede kreditomkostninger og ÅOP (Årlige Omkostninger i Procent) på 12,4%, jf. Kreditaftalelovens standardiserede beregningsmodel.",
        legalCitation: "Kreditaftalelovens § 7a & Markedsføringsloven",
        legalRationale: "Kreditor har ubetinget pligt til klart og tydeligt at oplyse ÅOP forud for aftaleindgåelsen. Manglende ÅOP medfører civilretlige sanktioner og bødeansvar.",
        isRemediated: false,
      },
      {
        id: "c3",
        section: "§ 8.3",
        title: "Ensidig gebyrændring og rykkeromkostninger",
        riskLevel: "warning",
        originalText: "Kreditor forbeholder sig ret til løbende og uden forudgående varsel at indføre administrative rykkergebyrer på op til 250 DKK pr. rykker.",
        fixedText: "Rykkergebyrer opkræves i overensstemmelse med Rentelovens § 9b med højst 100 DKK pr. rykkerskrivelse for maksimalt 3 rykkere med mindst 10 dages mellemrum.",
        legalCitation: "Rentelovens § 9b, stk. 2",
        legalRationale: "Opkrævning af 250 DKK pr. rykker overskrider det lovbestemte maksimum på 100 DKK i rentelovens præceptive regler for forbrugere.",
        isRemediated: false,
      },
      {
        id: "c4",
        section: "§ 11.1",
        title: "Behandling af person- og kreditdata",
        riskLevel: "compliant",
        originalText: "Personoplysninger behandles i overensstemmelse med databeskyttelsesforordningen (GDPR) og kreditaftalelovens krav til kreditværdighedsvurdering. Data slettes efter forældelsens indtræden.",
        fixedText: "Personoplysninger behandles i overensstemmelse med databeskyttelsesforordningen (GDPR) og kreditaftalelovens krav til kreditværdighedsvurdering. Data slettes efter forældelsens indtræden.",
        legalCitation: "GDPR Art. 6, stk. 1, litra b & c",
        legalRationale: "Klausulen overholder kravene til lovlig behandlingshjemmel og proportional opbevaringsperiode.",
        isRemediated: true,
      },
    ],
  },
  {
    id: "gdpr-dpa",
    title: "Databehandleraftale (GDPR / DPA)",
    category: "Compliance & Databeskyttelse",
    description: "Aftale mellem dataansvarlig og databehandler om cloud-hosting, underdatabehandlere og audits.",
    clauses: [
      {
        id: "g1",
        section: "§ 3.4",
        title: "Skift af underdatabehandlere uden samtykke",
        riskLevel: "critical",
        originalText: "Databehandleren kan til enhver tid frit tilknytte nye underdatabehandlere uden forudgående skriftlig underretning af den dataansvarlige.",
        fixedText: "Databehandleren må ikke antage en underdatabehandler uden forudgående specifik eller generel skriftlig godkendelse fra den dataansvarlige. Ved generel godkendelse skal der gives mindst 30 dages forudgående varsel med indsigelsesret jf. GDPR Art. 28, stk. 2.",
        legalCitation: "GDPR Art. 28, stk. 2",
        legalRationale: "Kravet om forudgående skriftlig godkendelse og varslingsret er præceptivt i henhold til EU-databeskyttelsesforordningen.",
        isRemediated: false,
      },
      {
        id: "g2",
        section: "§ 7.2",
        title: "Rapportering af sikkerhedsbrud",
        riskLevel: "warning",
        originalText: "Eventuelle brud på persondatasikkerheden skal undersøges internt og rapporteres til dataansvarlig, såfremt databehandleren skønner det hensigtsmæssigt inden for rimelig tid.",
        fixedText: "Databehandleren underretter den dataansvarlige uden unødig forsinkelse og senest 24 timer efter at være blevet opmærksom på, at der er sket et brud på persondatasikkerheden jf. GDPR Art. 33.",
        legalCitation: "GDPR Art. 33, stk. 2",
        legalRationale: "Databehandleren skal underrette uden unødig forsinkelse; et skøn om 'hensigtsmæssighed' strider mod lovens obligatoriske underretningspligt.",
        isRemediated: false,
      },
      {
        id: "g3",
        section: "§ 9.1",
        title: "Sletning ved aftaleophør",
        riskLevel: "compliant",
        originalText: "Ved ophør af behandlingsydelserne er databehandleren forpligtet til, efter den dataansvarliges valg, at slette eller tilbagelevere alle personoplysninger.",
        fixedText: "Ved ophør af behandlingsydelserne er databehandleren forpligtet til, efter den dataansvarliges valg, at slette eller tilbagelevere alle personoplysninger.",
        legalCitation: "GDPR Art. 28, stk. 3, litra g",
        legalRationale: "Klausulen spejler ordlyden i standardkontraktbestemmelserne (SCC) godkendt af Datatilsynet.",
        isRemediated: true,
      },
    ],
  },
];

export const ComplianceInspector: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>("debt-agreement");
  const [documents, setDocuments] = useState<ContractDocument[]>(presetDocuments);
  const [selectedClauseId, setSelectedClauseId] = useState<string>("c1");

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const activeClause = activeDoc.clauses.find((c) => c.id === selectedClauseId) || activeDoc.clauses[0];

  // Toggle remediation for a clause
  const toggleRemediation = (clauseId: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => {
        if (doc.id !== selectedDocId) return doc;
        return {
          ...doc,
          clauses: doc.clauses.map((c) => {
            if (c.id === clauseId) {
              const nextState = !c.isRemediated;
              return {
                ...c,
                isRemediated: nextState,
                riskLevel: nextState ? "compliant" : c.riskLevel === "compliant" ? "critical" : c.riskLevel,
              };
            }
            return c;
          }),
        };
      })
    );
  };

  // Remediate all clauses at once
  const remediateAll = () => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => {
        if (doc.id !== selectedDocId) return doc;
        return {
          ...doc,
          clauses: doc.clauses.map((c) => ({
            ...c,
            isRemediated: true,
            riskLevel: "compliant",
          })),
        };
      })
    );
  };

  // Reset document clauses
  const resetDocument = () => {
    setDocuments(presetDocuments);
  };

  // Dynamic Compliance Score Calculation
  const totalClauses = activeDoc.clauses.length;
  const compliantClauses = activeDoc.clauses.filter((c) => c.isRemediated || c.riskLevel === "compliant").length;
  const criticalClauses = activeDoc.clauses.filter((c) => !c.isRemediated && c.riskLevel === "critical").length;
  const warningClauses = activeDoc.clauses.filter((c) => !c.isRemediated && c.riskLevel === "warning").length;

  const score = Math.round(
    ((compliantClauses * 1.0 + warningClauses * 0.4) / totalClauses) * 100
  );

  // Export report handler
  const exportReport = () => {
    const reportText = [
      `=============================================================`,
      `JURIDISK AUDIT-RAPPORT: ${activeDoc.title.toUpperCase()}`,
      `Dato: ${new Date().toLocaleDateString("da-DK")} ${new Date().toLocaleTimeString("da-DK")}`,
      `Samlet Compliance Score: ${score}/100`,
      `Kritiske afvigelser: ${criticalClauses} | Advarsler: ${warningClauses} | Godkendte: ${compliantClauses}`,
      `=============================================================\n`,
      ...activeDoc.clauses.map((c) => {
        return [
          `[${c.section}] ${c.title}`,
          `Status: ${c.isRemediated ? "REMEDIERET (OVERHOLDER LOVEN)" : c.riskLevel.toUpperCase()}`,
          `Lovhenvisning: ${c.legalCitation}`,
          `Juridisk vurdering: ${c.legalRationale}`,
          `Gældende klausultekst:\n"${c.isRemediated ? c.fixedText : c.originalText}"`,
          `-------------------------------------------------------------`,
        ].join("\n");
      }),
    ].join("\n\n");

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Compliance_Audit_${activeDoc.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Document Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
        <div>
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" /> AI Juridisk Compliance & Klausul-Audit
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automatiseret scanning af kontrakter mod præceptive retsregler, GDPR og Finanstilsynets praksis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {documents.map((doc) => (
            <Button
              key={doc.id}
              size="sm"
              variant={doc.id === selectedDocId ? "default" : "outline"}
              onClick={() => {
                setSelectedDocId(doc.id);
                setSelectedClauseId(doc.clauses[0].id);
              }}
              className="text-xs h-8"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              {doc.title.split(" ")[0]} ({doc.category.split(" ")[0]})
            </Button>
          ))}
        </div>
      </div>

      {/* KPI & Compliance Meter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Compliance Score</span>
            <ShieldCheck className={`w-4 h-4 ${score >= 90 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-rose-500"}`} />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {score}<span className="text-sm font-normal text-muted-foreground">/100</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Kritiske Mangler</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {criticalClauses}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Kræver øjeblikkelig rettelse
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Advarsler</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {warningClauses}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Ubalance el. uklarhed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Godkendte Klausuler</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {compliantClauses} <span className="text-xs text-muted-foreground font-normal">af {totalClauses}</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Overholder standarder
          </div>
        </div>
      </div>

      {/* Main Split: Document View & Remediation Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Interactive Contract Clauses List */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-primary" /> Kontraktens Klausuler & Sektioner
            </h4>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={remediateAll}
                className="text-[11px] h-7 gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <Sparkles className="w-3 h-3" /> Udbedr alle
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetDocument}
                className="text-[11px] h-7 text-muted-foreground"
              >
                Nulstil
              </Button>
            </div>
          </div>

          <div className="space-y-2.5">
            {activeDoc.clauses.map((clause) => {
              const isSelected = clause.id === selectedClauseId;
              const isFixed = clause.isRemediated;

              let badgeColor = "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
              let badgeLabel = "Lovstridig";

              if (isFixed || clause.riskLevel === "compliant") {
                badgeColor = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
                badgeLabel = isFixed ? "Udbedret" : "Lovmedholdig";
              } else if (clause.riskLevel === "warning") {
                badgeColor = "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
                badgeLabel = "Risikabel";
              }

              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClauseId(clause.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                      : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">{clause.section}</span>
                      <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                        {clause.title}
                      </span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.2 border ${badgeColor}`}>
                      {badgeLabel}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                    "{isFixed ? clause.fixedText : clause.originalText}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 pt-1 border-t border-border/30">
                    <span className="font-mono text-[10px] truncate">{clause.legalCitation}</span>
                    <span className="text-primary font-medium flex items-center gap-1">
                      Inspicer <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Remediation Inspector */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-card border border-border/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <span className="font-mono text-xs text-primary font-bold">{activeClause.section}</span>
                <h4 className="text-base font-bold text-foreground mt-0.5">{activeClause.title}</h4>
              </div>

              <Button
                size="sm"
                variant={activeClause.isRemediated ? "outline" : "default"}
                onClick={() => toggleRemediation(activeClause.id)}
                className={`text-xs gap-1.5 ${
                  activeClause.isRemediated
                    ? "text-muted-foreground hover:text-foreground"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {activeClause.isRemediated ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" /> Gendan original
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" /> Anvend lovlig formulering
                  </>
                )}
              </Button>
            </div>

            {/* Legal Citation & Basis */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Lovhjemmel & Præceptiv Lovgivning</span>
              </div>
              <p className="text-xs font-mono text-primary font-medium">
                {activeClause.legalCitation}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeClause.legalRationale}
              </p>
            </div>

            {/* Text Comparison: Before / After */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Oprindelig Formulering (Kontraktudkast)
                  </span>
                  {!activeClause.isRemediated && (
                    <span className="text-[10px] text-rose-600 font-medium">Aktiv i udkast</span>
                  )}
                </div>
                <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  !activeClause.isRemediated
                    ? "bg-rose-500/10 border-rose-500/30 text-foreground"
                    : "bg-muted/20 border-border/40 text-muted-foreground opacity-60"
                }`}>
                  "{activeClause.originalText}"
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Foreslået Lovmedholdig Formulering
                  </span>
                  {activeClause.isRemediated && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Anvendt i kontrakt
                    </span>
                  )}
                </div>
                <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  activeClause.isRemediated
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground font-medium"
                    : "bg-muted/20 border-border/40 text-muted-foreground"
                }`}>
                  "{activeClause.fixedText}"
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-border/40">
              <span className="text-[11px] text-muted-foreground">
                Revisionsspor opdateres automatisk
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={exportReport}
                className="text-xs h-8 gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Hent Revisionsrapport
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small rotate icon helper
const RotateCcw: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default ComplianceInspector;
