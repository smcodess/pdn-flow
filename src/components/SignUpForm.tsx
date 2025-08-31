import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Lock, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendApiRequest, validateSignupForm } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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

interface SignupFormValues {
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
    password: string;
    confirmPassword: string;
}

interface SignUpFormProps {
    onSwitchToSignIn: () => void;
    onLogin: (authData: AuthResponse) => void; // Add this line
}

export const SignUpForm = ({ onSwitchToSignIn, onLogin }: SignUpFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<SignupFormValues>();

    const onSubmit = async (data: SignupFormValues) => {
        try {
            setIsLoading(true);
            clearErrors();

            const validation = validateSignupForm(data);

            if (!validation.isValid) {
                Object.entries(validation.errors).forEach(([field, message]) => {
                    setError(field as keyof SignupFormValues, { message });
                });
                return;
            }

            const { confirmPassword, ...requestData } = data;

            // const response: AuthResponse = await sendApiRequest(
            //     'http://localhost:8080/api/auth/signup',
            //     requestData,
            //     { method: "POST" }
            // );

            const response = {
                success: true,
                user: {
                    id: 123,
                    employeeId: "2732290",
                    fullName: "Satwik Mishra",
                    email: "mishra.satwik@tcs.com",
                    department: "Developer"
                },
                token: "Something",
                message: "success"
            };

            if (response.success) {
                console.log("Sign up successful", data, response);
                onLogin(response);
                toast({
                    title: "Account created successfully!",
                    description: `Welcome to JTRAC, ${data.fullName}.`,
                });
                navigate('/app');
            } else {
                throw new Error(response.message);
            }

        } catch (error) {
            toast({
                title: "Signup failed",
                description: error.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Create Account</h2>
                <p className="text-muted-foreground">
                    Enter your details to join your workspace
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* First Row - Employee ID and Full Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="employeeId"
                                placeholder="EMP001"
                                className="pl-10"
                                {...register("employeeId")}
                            />
                        </div>
                        {errors.employeeId && (
                            <p className="text-xs text-destructive">{errors.employeeId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="fullName"
                                placeholder="John Doe"
                                className="pl-10"
                                {...register("fullName")}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-xs text-destructive">{errors.fullName.message}</p>
                        )}
                    </div>
                </div>

                {/* Second Row - Email and Department */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@company.com"
                                className="pl-10"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="department"
                                placeholder="Engineering"
                                className="pl-10"
                                {...register("department")}
                            />
                        </div>
                        {errors.department && (
                            <p className="text-xs text-destructive">{errors.department.message}</p>
                        )}
                    </div>
                </div>

                {/* Third Row - Password and Confirm Password */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
            </form>

            <div className="text-center text-sm border-t border-border pt-6">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                    onClick={onSwitchToSignIn}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    Sign in
                </button>
            </div>
        </div>
    );
};