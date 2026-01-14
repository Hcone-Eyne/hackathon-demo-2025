import { BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";

const tabs = [
  { id: "learn" as const, label: "Learn", icon: BookOpen },
  { id: "chat" as const, label: "AI Assistant", icon: MessageCircle },
  { id: "checker" as const, label: "DBT Checker", icon: ShieldCheck },
];

export function BottomNavigation() {
  const { activeTab, setActiveTab } = useNavigation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom animate-slide-up">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300",
                "min-w-[64px] min-h-[44px]",
                "hover:scale-110 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn(
                "h-6 w-6 transition-all duration-300",
                isActive && "stroke-[2.5px] animate-bounce-in"
              )} />
              <span className={cn(
                "text-xs transition-all duration-300",
                isActive && "font-medium"
              )}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
