import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingDown,
  Calculator,
  Download,
  RotateCcw,
  Sliders,
  Percent,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MonthData {
  month: number;
  year: string;
  balance: number;
  principal: number;
  interestPaid: number;
  principalPaid: number;
  totalPaidCumulative: number;
}

export const DebtSimulator: React.FC = () => {
  // State
  const [principal, setPrincipal] = useState<number>(250000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(4500);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(6);
  const [haircutPercent, setHaircutPercent] = useState<number>(15);
  const [freezeInterestInMoratorium, setFreezeInterestInMoratorium] = useState<boolean>(true);

  // Presets
  const applyPreset = (preset: "danske" | "skifteret" | "highrisk" | "standard") => {
    if (preset === "danske") {
      setPrincipal(320000);
      setAnnualRate(5.5);
      setMonthlyPayment(5500);
      setMoratoriumMonths(6);
      setHaircutPercent(25);
      setFreezeInterestInMoratorium(true);
    } else if (preset === "skifteret") {
      setPrincipal(450000);
      setAnnualRate(0.0);
      setMonthlyPayment(7500);
      setMoratoriumMonths(0);
      setHaircutPercent(40);
      setFreezeInterestInMoratorium(true);
    } else if (preset === "highrisk") {
      setPrincipal(180000);
      setAnnualRate(15.0);
      setMonthlyPayment(3000);
      setMoratoriumMonths(3);
      setHaircutPercent(0);
      setFreezeInterestInMoratorium(false);
    } else {
      setPrincipal(250000);
      setAnnualRate(8.5);
      setMonthlyPayment(4500);
      setMoratoriumMonths(6);
      setHaircutPercent(15);
      setFreezeInterestInMoratorium(true);
    }
  };

  // Calculation Engine
  const simulation = useMemo(() => {
    const postHaircutPrincipal = Math.max(0, principal * (1 - haircutPercent / 100));
    const monthlyRate = annualRate / 100 / 12;

    const schedule: MonthData[] = [];
    let currentBalance = postHaircutPrincipal;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;
    let cumulativePaid = 0;

    // Month 0 start
    schedule.push({
      month: 0,
      year: "M0",
      balance: Math.round(currentBalance),
      principal: Math.round(currentBalance),
      interestPaid: 0,
      principalPaid: 0,
      totalPaidCumulative: 0,
    });

    const maxMonths = 240; // 20 years cap
    let payoffMonth: number | null = null;
    let isUnderpaying = false;

    for (let m = 1; m <= maxMonths; m++) {
      if (currentBalance <= 0) {
        if (payoffMonth === null) payoffMonth = m - 1;
        break;
      }

      const inMoratorium = m <= moratoriumMonths;
      let monthInterest = 0;

      if (inMoratorium) {
        if (!freezeInterestInMoratorium) {
          monthInterest = currentBalance * monthlyRate;
          currentBalance += monthInterest;
        }
        schedule.push({
          month: m,
          year: `M${m}`,
          balance: Math.round(currentBalance),
          principal: Math.round(currentBalance),
          interestPaid: Math.round(monthInterest),
          principalPaid: 0,
          totalPaidCumulative: Math.round(cumulativePaid),
        });
        continue;
      }

      // Normal active payment period
      monthInterest = currentBalance * monthlyRate;

      if (monthlyPayment <= monthInterest && currentBalance > 100) {
        isUnderpaying = true;
      }

      let payment = monthlyPayment;
      if (currentBalance + monthInterest < payment) {
        payment = currentBalance + monthInterest;
      }

      let interestPart = Math.min(payment, monthInterest);
      let principalPart = Math.max(0, payment - interestPart);

      currentBalance = Math.max(0, currentBalance + monthInterest - payment);
      totalInterestPaid += interestPart;
      totalPrincipalPaid += principalPart;
      cumulativePaid += payment;

      // Sample every month for first 24, then every 3-6 months to keep chart smooth
      if (m <= 36 || m % 3 === 0 || currentBalance === 0) {
        schedule.push({
          month: m,
          year: `M${m}`,
          balance: Math.round(currentBalance),
          principal: Math.round(currentBalance),
          interestPaid: Math.round(interestPart),
          principalPaid: Math.round(principalPart),
          totalPaidCumulative: Math.round(cumulativePaid),
        });
      }

      if (currentBalance === 0 && payoffMonth === null) {
        payoffMonth = m;
      }
    }

    if (payoffMonth === null && currentBalance > 0) {
      payoffMonth = maxMonths; // Over 20 years
    }

    const totalDebtorPayment = cumulativePaid;
    const haircutSavings = principal * (haircutPercent / 100);
    const recoveryRate = principal > 0 ? Math.min(100, Math.round((totalDebtorPayment / principal) * 100)) : 0;

    return {
      schedule,
      postHaircutPrincipal,
      totalInterestPaid: Math.round(totalInterestPaid),
      totalDebtorPayment: Math.round(totalDebtorPayment),
      haircutSavings: Math.round(haircutSavings),
      payoffMonth,
      recoveryRate,
      isUnderpaying,
    };
  }, [principal, annualRate, monthlyPayment, moratoriumMonths, haircutPercent, freezeInterestInMoratorium]);

  // CSV Export Handler
  const exportCSV = () => {
    const headers = ["Måned", "Restgæld (DKK)", "Månedlig Rente (DKK)", "Månedligt Afdrag (DKK)", "Akkumuleret Betalt (DKK)"];
    const rows = simulation.schedule.map((row) => [
      row.month,
      row.balance,
      row.interestPaid,
      row.principalPaid,
      row.totalPaidCumulative,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gaeldssanering_Simulation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Scenarios */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
        <div>
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" /> Vælg foruddefineret forhandlingsscenario
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test virkningen af akkordaftaler, henstand og rentenedsættelse på den samlede gældsbyrde.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyPreset("danske")}
            className="text-xs h-8 border-primary/30 hover:bg-primary/10"
          >
            Danske Bank Akkord
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyPreset("skifteret")}
            className="text-xs h-8 border-border hover:bg-muted"
          >
            Skifteretten (0% rente)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyPreset("highrisk")}
            className="text-xs h-8 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
          >
            Forbrugslån (15% rente)
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyPreset("standard")}
            className="text-xs h-8 text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Nulstil
          </Button>
        </div>
      </div>

      {/* Warning if underpaying */}
      {simulation.isUnderpaying && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-rose-700 dark:text-rose-300">
              Advarsel: Negativ amortisation (Gældsspiral)
            </span>
            <p className="text-rose-600/90 dark:text-rose-400/90">
              Den månedlige ydelse ({monthlyPayment.toLocaleString("da-DK")} DKK) er lavere end de løbende månedlige renter (ca. {Math.round((simulation.postHaircutPrincipal * annualRate / 1200)).toLocaleString("da-DK")} DKK). Restgælden vil stige i stedet for at blive nedbragt.
            </p>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Saneret Hovedstol</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {simulation.postHaircutPrincipal.toLocaleString("da-DK")} DKK
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            -{simulation.haircutSavings.toLocaleString("da-DK")} DKK ({haircutPercent}% akkord)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Afviklingstid</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {simulation.payoffMonth !== null && simulation.payoffMonth < 240
              ? `${Math.floor(simulation.payoffMonth / 12)} år ${simulation.payoffMonth % 12} mdr`
              : "> 20 år"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            inkl. {moratoriumMonths} mdr henstand
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Samlede Renter</span>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {simulation.totalInterestPaid.toLocaleString("da-DK")} DKK
          </div>
          <div className="text-[11px] text-muted-foreground">
            ved {annualRate}% debitorrente
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Genvindingsgrad</span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg md:text-xl font-bold text-foreground">
            {simulation.recoveryRate}%
          </div>
          <div className="text-[11px] text-muted-foreground">
            kreditors netto afkast
          </div>
        </div>
      </div>

      {/* Controls & Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-card border border-border/60 shadow-sm">
        {/* Left Column Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Oprindelig Gæld (Hovedstol)</label>
              <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                {principal.toLocaleString("da-DK")} DKK
              </span>
            </div>
            <Slider
              value={[principal]}
              min={25000}
              max={1000000}
              step={5000}
              onValueChange={(val) => setPrincipal(val[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Årlig Debitorrente</label>
              <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                {annualRate.toFixed(1)}%
              </span>
            </div>
            <Slider
              value={[annualRate]}
              min={0}
              max={22}
              step={0.5}
              onValueChange={(val) => setAnnualRate(val[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Månedlig Ydeevne (Betaling)</label>
              <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                {monthlyPayment.toLocaleString("da-DK")} DKK / md
              </span>
            </div>
            <Slider
              value={[monthlyPayment]}
              min={1000}
              max={25000}
              step={250}
              onValueChange={(val) => setMonthlyPayment(val[0])}
            />
          </div>
        </div>

        {/* Right Column Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Akkordnedslag / Gældseftergivelse</label>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {haircutPercent}% (-{Math.round(principal * (haircutPercent / 100)).toLocaleString("da-DK")} DKK)
              </span>
            </div>
            <Slider
              value={[haircutPercent]}
              min={0}
              max={60}
              step={5}
              onValueChange={(val) => setHaircutPercent(val[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-foreground">Moratorium / Henstandsperiode</label>
              <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                {moratoriumMonths} måneder
              </span>
            </div>
            <Slider
              value={[moratoriumMonths]}
              min={0}
              max={24}
              step={1}
              onValueChange={(val) => setMoratoriumMonths(val[0])}
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="freezeCheck"
                checked={freezeInterestInMoratorium}
                onChange={(e) => setFreezeInterestInMoratorium(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="freezeCheck" className="text-xs text-foreground font-medium cursor-pointer">
                Rentefrihed i henstandsperiode
              </label>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={exportCSV}
              className="text-xs h-8 gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Eksporter CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Chart View */}
      <div className="p-4 md:p-5 rounded-xl bg-card border border-border/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Gældsafvikling & Likviditetsprognose
            </h4>
            <p className="text-xs text-muted-foreground">
              Visuel fremskrivning af restgældens fald og akkumuleret betaling over tid
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Restgæld
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Akkumuleret betaling
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulation.schedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: string) => {
                  const label = name === "balance" ? "Restgæld" : "Akkumuleret betalt";
                  return [`${Number(value).toLocaleString("da-DK")} DKK`, label];
                }}
                labelFormatter={(label) => `Tidslinje: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
              <Area
                type="monotone"
                dataKey="totalPaidCumulative"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPaid)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Professional Legal & Methodological Notes */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Info className="w-4 h-4 text-primary" />
          <span>Finansteknisk & Juridisk Kontekst</span>
        </div>
        <p className="leading-relaxed">
          Denne beregningsmodel simulerer frivillige gældsforlig og saneringsplaner jf. principperne i konkurslovens regler om gældssanering og banksektorens akkorderingspraksis. Modellen tager højde for rentepauser (moratorium), akkordbeskæring og renters rente-effekter ved underfinansieret ydelseskapacitet.
        </p>
      </div>
    </div>
  );
};

export default DebtSimulator;
