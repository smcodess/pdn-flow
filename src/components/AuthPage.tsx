import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInForm } from "@/components/SignInForm";
import { SignUpForm } from "@/components/SignUpForm";
import "./AuthPage.css";

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

interface AuthPageProps {
    onLogin: (authData: AuthResponse) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleSwitch = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsSignUp(!isSignUp);
            setTimeout(() => setIsTransitioning(false), 50);
        }, 200);
    };

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6 relative overflow-hidden">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-glow/20 rounded-full blur-2xl"></div>
            </div>

            <div className="w-full max-w-6xl relative z-10 flex items-center gap-12">
                {/* Left Side - Branding */}
                <div className="flex-1 text-left animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl shadow-glow mb-8 animate-pulse">
                        <span className="text-3xl font-bold text-primary-foreground">JT</span>
                    </div>

                    <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                        JTRAC
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                        Join thousands of professionals managing their workflows efficiently.
                        {/* {isSignUp ? "Create your account and start tracking your project development today." : "Sign in to continue your project journey."} */}
                    </p>

                    <div className="space-y-4 text-muted-foreground">
                        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span>Comprehensive project tracking</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                            <span>Team collaboration tools</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-400"></div>
                            <span>Real-time progress monitoring</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Sliding Card */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative overflow-hidden">
                        <Card className="shadow-primary border-border/50 backdrop-blur-sm bg-card/90 hover:shadow-glow transition-all duration-300">
                            <CardContent className="p-8">
                                <div
                                    className={`transition-all duration-300 ${isTransitioning
                                        ? 'animate-slide-fade-out'
                                        : 'animate-slide-fade-in'
                                        }`}
                                >
                                    {!isSignUp ? (
                                        <SignInForm onSwitchToSignUp={handleSwitch} onLogin={onLogin} />
                                    ) : (
                                        <SignUpForm onSwitchToSignIn={handleSwitch} onLogin={onLogin} />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 text-xs text-muted-foreground">
                        <p>By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our Terms of Service and Privacy Policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};