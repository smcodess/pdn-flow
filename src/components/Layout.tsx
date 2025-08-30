import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut, 
  Menu, 
  Moon, 
  Sun, 
  GitBranch,
  Search
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

const gitRepositories = [
  "frontend-app",
  "backend-services", 
  "mobile-client",
  "data-pipeline",
  "auth-service",
  "notification-service"
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getActiveTab = () => {
    if (location.pathname === "/" || location.pathname === "/workspace") return "workspace";
    if (location.pathname === "/new-pdn") return "new-pdn";
    if (location.pathname === "/my-pdn") return "my-pdn";
    return "workspace";
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "workspace":
        navigate("/workspace");
        break;
      case "new-pdn":
        navigate("/new-pdn");
        break;
      case "my-pdn":
        navigate("/my-pdn");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-gradient-card backdrop-blur-sm shadow-sm">
        <div className="flex h-16 items-center px-4">
          {/* Mobile Sidebar Toggle */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4">
                <h3 className="font-semibold text-sm text-muted-foreground mb-4">Git Repositories</h3>
                <div className="space-y-2">
                  {gitRepositories.map((repo) => (
                    <div key={repo} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gradient-accent hover:text-accent-foreground cursor-pointer transition-all duration-200">
                      <GitBranch className="h-4 w-4" />
                      <span className="text-sm">{repo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">JTRAC</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 flex justify-center">
            <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-auto">
              <TabsList className="grid w-full grid-cols-3 bg-gradient-card shadow-sm">
                <TabsTrigger value="workspace" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">My Workspace</TabsTrigger>
                <TabsTrigger value="new-pdn" className="data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground">New PDN</TabsTrigger>
                <TabsTrigger value="my-pdn" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">My PDN</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Side - Theme Toggle, User Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-gradient-primary hover:text-primary-foreground"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gradient-accent hover:text-accent-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gradient-card shadow-colorful" align="end" forceMount>
                <DropdownMenuItem className="cursor-pointer hover:bg-gradient-primary hover:text-primary-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gradient-accent hover:text-accent-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r bg-gradient-card backdrop-blur-sm flex-col shadow-sm">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-primary" />
              <Input placeholder="Search repositories..." className="h-8 border-primary/20 focus:border-primary" />
            </div>
            <h3 className="font-semibold text-sm bg-gradient-accent bg-clip-text text-transparent mb-4">Git Repositories</h3>
            <div className="space-y-2">
              {gitRepositories.map((repo) => (
                <div key={repo} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gradient-primary hover:text-primary-foreground cursor-pointer transition-all duration-200 hover:shadow-colorful group">
                  <GitBranch className="h-4 w-4 text-accent group-hover:text-primary-foreground" />
                  <span className="text-sm font-medium">{repo}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}