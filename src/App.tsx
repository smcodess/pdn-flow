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
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import { AuthPage } from "./components/AuthPage";
import GitPDN from "./pages/GitPDN";
import { sendApiRequest } from "@/lib/utils";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { jwtDecode } from "jwt-decode";

const queryClient = new QueryClient();

interface AuthResponse {
  status: number;
  message: string;
  data: {
    empId: number;
    firstName: string;
    role: string;
    token?: string;
    lastName: string;
  };
}

const tokenUtils = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),

  decodeToken: (token: string) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  isTokenExpired: (token: string) => {
    const decoded = tokenUtils.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  isValidTokenFormat: (token: string) => {
    return token && token.split(".").length === 3;
  },
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthResponse["data"] | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenUtils.getToken();

        // console.log("tiqwuturuiqwtrqwu" + token);

        if (!token || !tokenUtils.isValidTokenFormat(token)) {
          setIsAuthenticated(false);
          setIsInitializing(false);
          return;
        }

        if (tokenUtils.isTokenExpired(token)) {
          tokenUtils.removeToken();
          setIsAuthenticated(false);
          setIsInitializing(false);
          return;
        }

        const decoded = tokenUtils.decodeToken(token) as any;
        if (decoded) {
          setUser({
            empId: decoded.sub ? parseInt(decoded.sub) : 0,
            firstName: decoded.firstName || "",
            lastName: decoded.lastName || "",
            role: decoded.role || "",
          });

          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          tokenUtils.removeToken();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
        tokenUtils.removeToken();
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (authData: AuthResponse) => {
    setIsAuthenticated(true);
    setUser(authData.data);

    if (authData.data.token) {
      tokenUtils.setToken(authData.data.token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    tokenUtils.removeToken();
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = tokenUtils.getToken();
    if (!token) return;

    const decoded = tokenUtils.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const timeUntilExpiry = decoded.exp * 1000 - Date.now();

    if (timeUntilExpiry > 0) {
      const timeoutId = setTimeout(() => {
        console.log("Token expired, logging out...");
        logout();
      }, timeUntilExpiry);

      return () => clearTimeout(timeoutId);
    } else {
      logout();
    }
  }, [isAuthenticated]);

  const ProtectedLayout = () => {
    if (isAuthenticated === null || isInitializing) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <ClimbingBoxLoader color="#3B82F6" size={12} />
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Loading...
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return <Layout onLogout={logout} user={user} />;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <ClimbingBoxLoader color="#3B82F6" size={12} />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="jtrac-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/app" replace />
                  ) : (
                    <Index />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? (
                    <Navigate to="/app" replace />
                  ) : (
                    <AuthPage onLogin={login} />
                  )
                }
              />

              <Route path="/app" element={<ProtectedLayout />}>
                <Route path="git/:gitRepo" element={<GitPDN />} />
                <Route path="workspace" element={<Workspace />} />
                <Route path="new-pdn" element={<NewPDN />} />
                <Route path="my-pdn" element={<MyPDN user={user} />} />
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
