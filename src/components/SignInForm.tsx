import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { sendApiRequest, validateSigninForm } from "@/lib/utils";

interface SignInFormValues {
  empId: number;
  password: string;
}

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
    setError,
  } = useForm<SignInFormValues>();

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);

      data.empId = Number(data.empId);

      const validation = validateSigninForm(data);

      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([field, message]) => {
          setError(field as keyof SignInFormValues, { message });
        });
        return;
      }

      // console.log(data)

      const response: AuthResponse = await sendApiRequest(
        "http://localhost:8080/api/auth/login",
        data,
        { method: "POST" }
      );

      console.log(response);

      if (response.message == "Success") {
        onLogin(response);
        toast({
          title: "Welcome back!",
          description: `Successfully signed in to JTRAC.`,
        });
        navigate("/app/git/All-GIT");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description:
          error.message || "Please check your credentials and try again.",
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
        <p className="text-muted-foreground">Sign in to your myTRAC account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="signin-empId">Employee ID</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="signin-empId"
              type="number"
              placeholder="Employee ID"
              className="pl-10"
              {...register("empId")}
            />
          </div>
          {errors.empId && (
            <p className="text-xs text-destructive">{errors.empId.message}</p>
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
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
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
