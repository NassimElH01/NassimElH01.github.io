import React from "react";
import { useAscension } from "@/lib/ascension/store";
import { levelFromXp, effectiveStreak } from "@/lib/ascension/progress";
import { rarityFor, RARITY_TIERS } from "@/lib/ascension/rarity";
import { XpHeader } from "@/components/ascension/XpHeader";
import { RarityBadge } from "@/components/ascension/RarityBadge";

export function CharacterScreen() {
  const { state, ready } = useAscension();
  if (!ready) return <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">Loading…</div>;

  const { level, into, span } = levelFromXp(state.xp);
  const cards = state.cards.filter((c) => !c.archived);
  const completions = cards.reduce((n, c) => n + c.totalCompletions, 0);
  const relics = Array.from(new Set(cards.flatMap((c) => c.effects)));

  return (
    <div className="space-y-4">
      <XpHeader xp={state.xp} freezes={state.freezes} />
      <main className="mx-auto max-w-md space-y-5 px-1 pt-2">
        <h2 className="font-display text-2xl font-bold text-primary">Your Ascent</h2>

        <section className="grid grid-cols-3 gap-2 text-center">
          <Box label="Level" value={`${level}`} />
          <Box label="XP" value={`${state.xp}`} />
          <Box label="Completions" value={`${completions}`} />
        </section>
        <p className="text-xs text-muted-foreground text-center">
          {span - into} XP needed to reach Level {level + 1}.
        </p>

        <section className="rounded-xl border border-border bg-card/60 p-4">
          <h3 className="font-display text-sm font-semibold text-primary mb-2">Rarity distribution</h3>
          <ul className="space-y-2">
            {RARITY_TIERS.map((tier) => {
              const owned = cards.filter((c) => rarityFor(effectiveStreak(c)).id === tier.id);
              return (
                <li
                  key={tier.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <RarityBadge tier={tier} />
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {tier.min}
                      {tier.max === null ? "+" : `–${tier.max}`} days · {tier.note}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-lg font-bold text-foreground">{owned.length}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card/60 p-4">
          <h3 className="font-display text-sm font-semibold text-primary mb-2">Relics & Artifacts</h3>
          {relics.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No relics discovered yet. Completing rites occasionally yields artifacts from the sky sanctuaries.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {relics.map((r) => (
                <li
                  key={r}
                  className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs capitalize text-primary font-medium"
                >
                  {r.replace("-", " ")}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/50 px-2 py-3">
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">{label}</p>
    </div>
  );
}
