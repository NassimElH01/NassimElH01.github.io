import React from "react";
import { Settings } from "lucide-react";
import { useAscension } from "@/lib/ascension/store";
import { XpHeader } from "@/components/ascension/XpHeader";
import { dayKeyOffset, effectiveStreak, todayKey } from "@/lib/ascension/progress";
import { cn } from "@/lib/utils";
import type { AscensionSubTab } from "../BottomNav";

interface ProgressScreenProps {
  onOpenCard: (cardId: string) => void;
  onNavigate: (tab: AscensionSubTab) => void;
}

const DAYS = 28;

export function ProgressScreen({ onOpenCard, onNavigate }: ProgressScreenProps) {
  const { state, ready } = useAscension();
  if (!ready)
    return (
      <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">Loading…</div>
    );

  const cards = state.cards.filter((c) => !c.archived);
  const days = Array.from({ length: DAYS }, (_, i) => dayKeyOffset(i - (DAYS - 1)));
  const perDay = days.map((day) => ({
    day,
    count: cards.filter((c) => c.history.includes(day)).length,
  }));
  const today = todayKey();
  const recent = cards
    .flatMap((c) => c.history.map((day) => ({ day, title: c.title })))
    .sort((a, b) => (a.day < b.day ? 1 : -1))
    .slice(0, 12);

  return (
    <div className="space-y-4">
      <XpHeader xp={state.xp} freezes={state.freezes} />
      <main className="mx-auto max-w-md space-y-6 px-1 pt-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold text-primary">Progress</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Missed days simply stay empty. Nothing is lost from your record.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            aria-label="Settings"
            className="press-pop grid size-10 shrink-0 place-items-center rounded-md border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Settings className="size-4" aria-hidden="true" />
          </button>
        </div>

        <section className="rounded-xl border border-border bg-card/60 p-4">
          <h3 className="font-display text-sm font-semibold text-primary mb-2">Last 28 days</h3>
          <ul className="grid grid-cols-7 gap-1.5" aria-label="Completions per day">
            {perDay.map(({ day, count }) => (
              <li
                key={day}
                title={`${day}: ${count} completion${count === 1 ? "" : "s"}`}
                className={cn(
                  "aspect-square rounded-sm border border-border/60 transition-colors",
                  count === 0 && "bg-secondary/40",
                  count === 1 && "bg-primary/35",
                  count === 2 && "bg-primary/60",
                  count >= 3 && "bg-primary",
                  day === today && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                )}
              >
                <span className="sr-only">
                  {day}: {count} completions
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card/60 p-4">
          <h3 className="font-display text-sm font-semibold text-primary mb-2">Streaks by card</h3>
          <ul className="space-y-2">
            {cards.map((card) => (
              <li
                key={card.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background/50 px-3 py-2"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenCard(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenCard(card.id);
                    }
                  }}
                  className="min-w-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="block truncate text-sm font-semibold hover:text-primary transition-colors text-foreground">{card.title}</span>
                  <span className="block text-[11px] text-muted-foreground font-mono">
                    current {effectiveStreak(card)}d · best {card.longestStreak}d · {card.totalCompletions}{" "}
                    total
                  </span>
                </div>
                <span className="shrink-0 font-display text-lg font-bold text-primary">{effectiveStreak(card)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card/60 p-4">
          <h3 className="font-display text-sm font-semibold text-primary mb-2">Recent activity</h3>
          {recent.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nothing recorded yet. Your first completion starts the ledger.
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((entry, i) => (
                <li
                  key={`${entry.day}-${entry.title}-${i}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border/40 pb-1.5 text-xs last:border-b-0"
                >
                  <span className="truncate font-medium text-foreground">{entry.title}</span>
                  <span className="shrink-0 text-muted-foreground font-mono">{entry.day}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
