import { useState } from "react";
import { Check, Flame, Settings } from "lucide-react";
import { useAscension } from "@/lib/ascension/store";
import { Onboarding } from "@/components/ascension/Onboarding";
import { XpHeader } from "@/components/ascension/XpHeader";
import { RarityBadge } from "@/components/ascension/RarityBadge";
import { haptic } from "@/lib/ascension/haptics";
import { rarityFor } from "@/lib/ascension/rarity";
import { campaignState } from "@/lib/ascension/campaign";
import { effectiveStreak, isCompletedToday } from "@/lib/ascension/progress";
import { cn } from "@/lib/utils";
import type { HabitCard } from "@/lib/ascension/types";
import type { AscensionSubTab } from "../BottomNav";

interface TodayScreenProps {
  onOpenCard: (cardId: string) => void;
  onNavigate: (tab: AscensionSubTab) => void;
}

export function TodayScreen({ onOpenCard, onNavigate }: TodayScreenProps) {
  const { state, ready, complete } = useAscension();
  const [toast, setToast] = useState<string | null>(null);
  const [xpPop, setXpPop] = useState(false);

  if (!ready) {
    return (
      <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">
        Unsealing your collection…
      </div>
    );
  }

  if (!state.onboarded) return <Onboarding />;

  const active = state.cards.filter((c) => !c.archived);
  const done = active.filter((c) => isCompletedToday(c));
  const campaign = campaignState(state.cards);

  function onComplete(card: HabitCard) {
    const result = complete(card.id);
    if (!result) return;
    haptic(result.tierChanged ? "thud" : "tick");
    setXpPop(true);
    window.setTimeout(() => setXpPop(false), 400);
    const parts = [`+${result.xpGained} XP`];
    if (result.tierChanged) parts.push(`${card.title} rose in rarity`);
    if (result.drop) parts.push(`${result.drop.label} found`);
    if (result.freezeUsed) parts.push("streak freeze spent");
    setToast(parts.join(" · "));
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="space-y-4">
      <XpHeader xp={state.xp} freezes={state.freezes} pulsing={xpPop} />

      <div className="mx-auto max-w-md px-1 pt-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-primary font-bold">Today&rsquo;s rites</h2>
            <p className="text-xs text-muted-foreground">
              {done.length} of {active.length} kept today
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

        {active.length > 0 && (
          <div
            onClick={() => onNavigate("campaign")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNavigate("campaign");
              }
            }}
            className="press-pop mt-4 block cursor-pointer rounded-md border border-primary/40 bg-primary/5 px-4 py-3 text-left transition-colors hover:bg-primary/10"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              {campaign.act.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed font-medium text-foreground">
              {campaign.focusQuest
                ? campaign.focusQuest.complete
                  ? `${campaign.focusQuest.quest.name} is complete.`
                  : `${campaign.focusQuest.quest.name} — ${
                      campaign.focusQuest.next
                        ? `${campaign.focusQuest.remaining} more rite${campaign.focusQuest.remaining === 1 ? "" : "s"} opens ${campaign.focusQuest.next.title}`
                        : "the next chapter awaits"
                    }`
                : campaign.act.line}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {campaign.chaptersOpen} of {campaign.chaptersTotal} chapters open · view the campaign →
            </p>
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {active.map((card) => {
            const streak = effectiveStreak(card);
            const tier = rarityFor(streak);
            const isDone = isCompletedToday(card);
            return (
              <li
                key={card.id}
                className={cn(
                  "rarity-frame grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 rounded-lg",
                  tier.frameClass,
                )}
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
                  <span className="block truncate font-display text-base font-semibold leading-tight text-foreground hover:text-primary transition-colors">
                    {card.title}
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <RarityBadge tier={tier} />
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                      <Flame className="size-3.5 text-amber-500" aria-hidden="true" />
                      {streak}
                      <span className="sr-only">day streak</span>
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onPointerUp={() => !isDone && onComplete(card)}
                  disabled={isDone}
                  aria-label={isDone ? `${card.title} kept today` : `Complete ${card.title}`}
                  className={cn(
                    "press-pop grid size-12 shrink-0 place-items-center rounded-md text-sm font-semibold transition-all",
                    isDone
                      ? "border border-border/70 bg-secondary text-muted-foreground opacity-60"
                      : "bg-primary text-primary-foreground hover:scale-105 shadow-sm",
                  )}
                >
                  <Check className="size-5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        {done.length === active.length && active.length > 0 && (
          <p className="mt-4 rounded-md border border-primary/30 bg-card/50 px-3 py-2 text-center text-xs text-muted-foreground">
            Every rite kept. The rest of the day is yours.
          </p>
        )}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90vw] rounded-md border border-primary/40 bg-card px-4 py-2 text-center text-sm shadow-[var(--shadow-card)] text-foreground font-medium animate-in fade-in"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
