import { motion } from "framer-motion";
import { FileText, Cloud, Newspaper, Gamepad2, Briefcase } from "lucide-react";
import { Language, translations } from "@/lib/translations";

type TabType = "cv" | "weather" | "news" | "games" | "projects";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

const TabNavigation = ({ activeTab, onTabChange, language }: TabNavigationProps) => {
  const t = translations[language].tabs;
  const tabs = [
    { id: "cv" as TabType, label: t.cv, icon: FileText },
    { id: "projects" as TabType, label: t.projects, icon: Briefcase },
    { id: "games" as TabType, label: t.games, icon: Gamepad2 },
    { id: "weather" as TabType, label: t.weather, icon: Cloud },
    { id: "news" as TabType, label: t.news, icon: Newspaper },
  ];
  return (
    <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs" aria-label="Hovednavigation">
      <div className="max-w-4xl mx-auto overflow-x-auto">
        <div className="flex min-w-max overflow-x-auto" role="tablist" aria-orientation="horizontal">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-4 text-xs sm:text-sm md:text-base font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
