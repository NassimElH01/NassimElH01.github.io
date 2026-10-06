import React from "react";
import { ArrowLeft } from "lucide-react";
import { useAscension } from "@/lib/ascension/store";
import { Switch } from "@/components/ui/switch";
import { clearState } from "@/lib/ascension/storage";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { state, ready, setReducedMotion, reset } = useAscension();
  if (!ready) return <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-md space-y-5 px-1 pt-4 pb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="press-pop grid size-10 place-items-center rounded-md border border-border/70 bg-card text-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h2 className="font-display text-2xl font-bold text-primary">Settings</h2>
      </div>

      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card/60 px-4 py-3">
        <label htmlFor="reduced-motion" className="min-w-0 cursor-pointer">
          <span className="block text-sm font-semibold text-foreground">Reduced motion</span>
          <span className="block text-xs text-muted-foreground">
            Replace spring pops and particles with subtle instant fades.
          </span>
        </label>
        <Switch
          id="reduced-motion"
          checked={state.reducedMotion}
          onCheckedChange={setReducedMotion}
        />
      </section>

      <section className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Streak freezes</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          You currently hold <strong className="text-primary font-bold">{state.freezes}</strong> streak freeze{state.freezes === 1 ? "" : "s"}. A freeze quietly covers one missed day so a single busy day never breaks your progression streak. More are earned as you level up.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Local storage & privacy</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Everything is stored locally on this device (IndexedDB / localStorage) and works completely offline. No habit data is sent to external servers.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all Ascension Cards progress?")) {
              void clearState();
              reset();
              onBack();
            }
          }}
          className="press-pop mt-3 min-h-10 w-full rounded-md border border-destructive/50 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
        >
          Reset and start over
        </button>
      </section>
    </div>
  );
}
