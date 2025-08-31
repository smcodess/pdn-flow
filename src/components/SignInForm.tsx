import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { sendApiRequest, validateSigninForm } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

interface SignInFormValues {
  email: string;
  password: string;
}

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

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onLogin: (authData: AuthResponse) => void;
}

export const SignInForm = ({ onSwitchToSignUp, onLogin }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<SignInFormValues>();

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);

      const validation = validateSigninForm(data);

      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([field, message]) => {
          setError(field as keyof SignInFormValues, { message });
        });
        return;
      }

      // const response: AuthResponse = await sendApiRequest(
      //   'http://localhost:8080/api/auth/signin',
      //   data,
      //   { method: "POST" } 
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
        onLogin(response);
        toast({
          title: "Welcome back!",
          description: `Successfully signed in to JTRAC.`,
        });
        navigate('/app/workspace');
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to your JTRAC account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signin-email"
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
          <Label htmlFor="signin-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signin-password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <button
            type="button"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm border-t border-border pt-6">
        <span className="text-muted-foreground">Don't have an account? </span>
        <button
          onClick={onSwitchToSignUp}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};