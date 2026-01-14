import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { NavigationProvider } from "./contexts/NavigationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { InstallPrompt } from "./components/InstallPrompt";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { ErrorBoundary } from "./components/ErrorBoundary";

/* pages */
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import LessonDetail from "./pages/LessonDetail";
import Chat from "./pages/Chat";
import DBTChecker from "./pages/DBTChecker";
import CheckerResult from "./pages/CheckerResult";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Offline from "./pages/Offline";

const queryClient = new QueryClient();

/* ------------------------ LOWERCASE NORMALIZER ------------------------ */
function NormalizeRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const lower = location.pathname.toLowerCase();
    if (location.pathname !== lower) {
      navigate(lower + location.search + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

/* ------------------------------ MAIN APP ------------------------------ */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineIndicator />
        <InstallPrompt />
        <UpdatePrompt />

        <BrowserRouter>
          <NormalizeRoutes />

          <AuthProvider>
            <NavigationProvider>
              <Routes>
                <Route path="/" element={<Index />} />

                <Route path="/auth" element={<Auth />} />
                <Route path="/about" element={<About />} />
                <Route path="/offline" element={<Offline />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Learn />} />
                  <Route path="learn" element={<Learn />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="checker" element={<DBTChecker />} />
                </Route>

                <Route
                  path="/learn/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonDetail />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checker/result"
                  element={
                    <ProtectedRoute>
                      <CheckerResult />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* LAST */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NavigationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
