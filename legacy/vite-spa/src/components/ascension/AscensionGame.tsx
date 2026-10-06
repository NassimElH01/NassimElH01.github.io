import { useState } from "react";
import { AscensionProvider } from "@/lib/ascension/store";
import { BottomNav, type AscensionSubTab } from "./BottomNav";
import { TodayScreen } from "./screens/TodayScreen";
import { CardsScreen } from "./screens/CardsScreen";
import { CardDetailScreen } from "./screens/CardDetailScreen";
import { WorldScreen } from "./screens/WorldScreen";
import { CampaignScreen } from "./screens/CampaignScreen";
import { CharacterScreen } from "./screens/CharacterScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

function AscensionGameContent() {
  const [activeTab, setActiveTab] = useState<AscensionSubTab>("today");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleOpenCard = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleNavigate = (tab: AscensionSubTab) => {
    setSelectedCardId(null);
    setActiveTab(tab);
  };

  const renderActiveView = () => {
    if (selectedCardId) {
      return (
        <CardDetailScreen
          cardId={selectedCardId}
          onBack={() => setSelectedCardId(null)}
        />
      );
    }

    switch (activeTab) {
      case "today":
        return <TodayScreen onOpenCard={handleOpenCard} onNavigate={handleNavigate} />;
      case "cards":
        return <CardsScreen onOpenCard={handleOpenCard} />;
      case "world":
        return <WorldScreen onNavigate={handleNavigate} />;
      case "campaign":
        return <CampaignScreen onOpenCard={handleOpenCard} onNavigate={handleNavigate} />;
      case "character":
        return <CharacterScreen />;
      case "progress":
        return <ProgressScreen onOpenCard={handleOpenCard} onNavigate={handleNavigate} />;
      case "settings":
        return <SettingsScreen onBack={() => handleNavigate("today")} />;
      default:
        return <TodayScreen onOpenCard={handleOpenCard} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="ascension-scope relative w-full max-w-4xl mx-auto rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden p-3 sm:p-5">
      <div className="min-h-[500px]">
        {renderActiveView()}
      </div>

      {!selectedCardId && activeTab !== "settings" && (
        <BottomNav activeTab={activeTab} onSelectTab={handleNavigate} />
      )}
    </div>
  );
}

export function AscensionGame() {
  return (
    <AscensionProvider>
      <AscensionGameContent />
    </AscensionProvider>
  );
}

export default AscensionGame;
