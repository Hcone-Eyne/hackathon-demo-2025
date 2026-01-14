import { Outlet } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { language } = useNavigation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              {getGreeting()}
            </h2>
            <p className="text-xs text-muted-foreground capitalize">
              Language: {language}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="rounded-full"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
