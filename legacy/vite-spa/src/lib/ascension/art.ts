import runner from "@/assets/cards/card-runner.jpg";
import meditator from "@/assets/cards/card-meditator.jpg";
import ironbound from "@/assets/cards/card-ironbound.jpg";
import scribe from "@/assets/cards/card-scribe.jpg";
import cartographer from "@/assets/cards/card-cartographer.jpg";
import alchemist from "@/assets/cards/card-alchemist.jpg";
import springbearer from "@/assets/cards/card-springbearer.jpg";

export const CARD_ART: Record<string, string> = {
  runner,
  meditator,
  ironbound,
  scribe,
  cartographer,
  alchemist,
  springbearer,
};

export const ART_KEYS = Object.keys(CARD_ART);

export function artFor(key: string): string {
  return CARD_ART[key] ?? (CARD_ART['meditator'] as string);
}
