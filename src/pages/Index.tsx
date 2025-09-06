import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto px-4">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl shadow-glow mb-8">
          <span className="text-3xl font-bold text-white">JT</span>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          myTRAC
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto">
          Professional workspace management for modern teams. Track, manage, and collaborate efficiently.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          {/* <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Sign In
          </Button> */}
        </div>

        <div className="mt-16 text-sm text-muted-foreground">
          <p>Trusted by teams worldwide for project development tracking</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
