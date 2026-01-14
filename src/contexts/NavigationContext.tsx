import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type TabType = "learn" | "chat" | "checker";

interface NavigationContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("learn");
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("app-language") || "english";
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard/learn") || path === "/dashboard") setActiveTab("learn");
    else if (path.includes("/dashboard/chat")) setActiveTab("chat");
    else if (path.includes("/dashboard/checker")) setActiveTab("checker");
  }, [location.pathname]);

  // Navigate when tab changes
  const handleSetActiveTab = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  // Persist language preference
  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        language,
        setLanguage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
