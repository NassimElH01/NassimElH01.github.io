import { useState } from "react";
import { Plus } from "lucide-react";
import { useAscension, useMotionAllowed } from "@/lib/ascension/store";
import { HabitCardTile } from "@/components/ascension/HabitCardTile";
import { XpHeader } from "@/components/ascension/XpHeader";
import { NewCardSheet } from "@/components/ascension/NewCardSheet";
import { haptic } from "@/lib/ascension/haptics";
import type { HabitCard } from "@/lib/ascension/types";

interface CardsScreenProps {
  onOpenCard: (cardId: string) => void;
}

export function CardsScreen({ onOpenCard }: CardsScreenProps) {
  const { state, ready, complete } = useAscension();
  const motion = useMotionAllowed();
  const [toast, setToast] = useState<string | null>(null);
  const [xpPop, setXpPop] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!ready) {
    return (
      <div className="grid min-h-[300px] place-items-center text-sm text-muted-foreground">
        Unsealing your collection…
      </div>
    );
  }

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

  const active = state.cards.filter((c) => !c.archived);

  return (
    <div className="space-y-4">
      <XpHeader xp={state.xp} freezes={state.freezes} pulsing={xpPop} />

      <div className="mx-auto max-w-lg px-1 pt-2">
        <div className="flex justify-between items-baseline mb-3">
          <div>
            <h2 className="font-display text-xl text-primary font-bold">The collection</h2>
            <p className="text-xs text-muted-foreground">
              {active.length} card{active.length === 1 ? "" : "s"} bound
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              haptic("tick");
              setSheetOpen(true);
            }}
            className="press-pop inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            <span>Forge card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {active.map((card) => (
            <HabitCardTile
              key={card.id}
              card={card}
              onComplete={onComplete}
              onSelect={() => onOpenCard(card.id)}
              motion={motion}
            />
          ))}
        </div>

        <button
          type="button"
          onPointerUp={() => {
            haptic("tick");
            setSheetOpen(true);
          }}
          className="press-pop mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          <Plus className="size-4" aria-hidden="true" />
          Forge a new custom card
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90vw] rounded-md border border-primary/40 bg-card px-4 py-2 text-center text-sm shadow-[var(--shadow-card)] text-foreground font-medium animate-in fade-in"
        >
          {toast}
        </div>
      )}

      <NewCardSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
