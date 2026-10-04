import React from "react";
import { ArrowLeft, Archive, Check, Flame, Trophy } from "lucide-react";
import { useAscension, useMotionAllowed } from "@/lib/ascension/store";
import { artFor } from "@/lib/ascension/art";
import { rarityFor, daysToNextTier, tierProgress, AUTOMATICITY_DAYS } from "@/lib/ascension/rarity";
import { effectiveStreak, isCompletedToday } from "@/lib/ascension/progress";
import { RarityBadge } from "@/components/ascension/RarityBadge";
import { haptic } from "@/lib/ascension/haptics";
import { cn } from "@/lib/utils";

interface CardDetailScreenProps {
  cardId: string;
  onBack: () => void;
}

export function CardDetailScreen({ cardId, onBack }: CardDetailScreenProps) {
  const { state, ready, complete, archiveCard } = useAscension();
  const motion = useMotionAllowed();
  const card = state.cards.find((c) => c.id === cardId);

  if (!ready) return <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">Loading…</div>;

  if (!card) {
    return (
      <div className="grid min-h-[300px] place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-xl font-bold">This card isn't in your collection</h1>
          <button onClick={onBack} className="mt-4 inline-block text-sm text-primary underline">
            Back to collection
          </button>
        </div>
      </div>
    );
  }

  const streak = effectiveStreak(card);
  const tier = rarityFor(streak);
  const next = daysToNextTier(streak);
  const done = isCompletedToday(card);
  const recent = card.history.slice(-28);

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-6">
      <div className="relative overflow-hidden rounded-xl border border-border/60">
        <img
          src={artFor(card.art)}
          alt={`Portrait artwork for ${card.title}`}
          width={768}
          height={1024}
          className="h-[40vh] min-h-[260px] max-h-[380px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className={cn("absolute inset-0 opacity-25", `texture-${tier.id}`)} aria-hidden="true" />
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to collection"
          className="press-pop absolute left-3 top-3 grid size-10 place-items-center rounded-md border border-border/70 bg-background/80 backdrop-blur text-foreground hover:bg-background"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="absolute inset-x-4 bottom-4">
          <RarityBadge tier={tier} size="md" className="bg-background/80 backdrop-blur-sm" />
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold leading-tight text-foreground">{card.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
        </div>
      </div>

      <main className="space-y-4 px-1">
        <blockquote className="rounded-md border-l-2 border-primary/60 bg-card/60 px-4 py-3 text-sm italic text-muted-foreground">
          “{card.quote}”
          <footer className="mt-1 not-italic font-medium text-foreground/80">— {card.author}</footer>
        </blockquote>

        <section className="grid grid-cols-3 gap-2 text-center">
          <Stat icon={<Flame className="size-4 text-amber-500" />} label="Current" value={`${streak}d`} />
          <Stat icon={<Trophy className="size-4 text-primary" />} label="Longest" value={`${card.longestStreak}d`} />
          <Stat icon={<Check className="size-4 text-emerald-500" />} label="Total" value={`${card.totalCompletions}`} />
        </section>

        <section className="rounded-md border border-border bg-card/50 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-primary">{tier.label} · {tier.note}</h2>
            <span className="text-xs text-muted-foreground font-mono">
              {next ? `${next.days}d to ${next.tier.label}` : "Top tier reached"}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${Math.round(tierProgress(streak) * 100)}%`,
                backgroundColor: `var(--rarity-${tier.id})`,
              }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {streak >= AUTOMATICITY_DAYS
              ? "Past the 66-day median for automaticity — this habit is becoming second nature."
              : `${AUTOMATICITY_DAYS - streak} days remaining until the 66-day automaticity milestone.`}
          </p>
        </section>

        <section className="rounded-md border border-border bg-card/50 p-4">
          <h2 className="font-display text-sm font-semibold text-primary mb-2">Last four weeks</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 28 }).map((_, i) => {
              const day = new Date();
              day.setDate(day.getDate() - (27 - i));
              const key = `${day.getFullYear()}-${`${day.getMonth() + 1}`.padStart(2, "0")}-${`${day.getDate()}`.padStart(2, "0")}`;
              const hit = recent.includes(key);
              return (
                <div
                  key={key}
                  title={key}
                  aria-label={`${key}: ${hit ? "completed" : "not completed"}`}
                  className={cn(
                    "aspect-square rounded-sm border transition-colors",
                    hit ? "border-primary/60 bg-primary/80" : "border-border/60 bg-secondary/40",
                  )}
                />
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Missed days simply reset the current streak. Your history and longest streak stay safe.
          </p>
        </section>

        <button
          type="button"
          disabled={done}
          onPointerUp={() => {
            const result = complete(card.id);
            if (result) haptic(result.tierChanged ? "thud" : "tick");
          }}
          className={cn(
            "press-pop flex min-h-12 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all",
            done ? "border border-border bg-secondary text-muted-foreground opacity-60" : "bg-primary text-primary-foreground shadow-md hover:scale-[1.01]",
            motion && !done && "transition-transform",
          )}
        >
          <Check className="size-5" aria-hidden="true" />
          {done ? "Completed today" : "Complete today"}
        </button>

        <button
          type="button"
          onPointerUp={() => {
            archiveCard(card.id);
            onBack();
          }}
          className="press-pop flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
        >
          <Archive className="size-3.5" aria-hidden="true" />
          Retire this card
        </button>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/50 px-2 py-2.5">
      <div className="flex items-center justify-center gap-1">{icon}</div>
      <p className="mt-1 font-display text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">{label}</p>
    </div>
  );
}
