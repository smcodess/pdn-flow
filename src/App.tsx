import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Layout } from "@/components/Layout";
import Workspace from "./pages/Workspace";
import NewPDN from "./pages/NewPDN";
import MyPDN from "./pages/MyPDN";
import ViewPDN from "./pages/ViewPDN";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import Index from "./pages/Index";
import { AuthPage } from "./components/AuthPage";

const queryClient = new QueryClient();

interface AuthResponse {
  success: boolean;
  user: {
    id: number;
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
  };
  token?: string;
  message: string;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  const login = (authData: AuthResponse) => {
    setIsAuthenticated(true);
    setUser(authData.user);
    if (authData.token) {
      localStorage.setItem('token', authData.token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const ProtectedLayout = () => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <Layout/>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="jtrac-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<AuthPage onLogin={login} />} />

              <Route path="/app" element={<ProtectedLayout />}>
                <Route path="workspace" element={<Workspace />} />
                <Route path="new-pdn" element={<NewPDN />} />
                <Route path="my-pdn" element={<MyPDN />} />
                <Route path="pdn/:id" element={<ViewPDN />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;