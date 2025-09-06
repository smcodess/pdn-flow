import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Lock, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendApiRequest, validateSignupForm } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { register } from "module";

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

interface SignupFormValues {
  employeeId: string;
  fullName: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onLogin: (authData: AuthResponse) => void;
}

const roleTypes = ["Developer", "Reviewer", "Admin", "Deployer", "Tester"];

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
    clearErrors,
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

      console.log(requestData);
      //   const response: AuthResponse = await sendApiRequest(
      //     "http://localhost:8080/api/auth/signup",
      //     requestData,
      //     { method: "POST" }
      //   );

      //   console.log(response);

      const response = {
        status: 200,
        message: "Success",
        data: {
          token:
            "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzc5NTI0Iiwicm9sZSI6IkRldmVsb3BlciIsImZpcnN0TmFtZSI6IlJhamFyc2hpIiwibGFzdE5hbWUiOiJNYW5uYSIsImlzQWN0aXZlIjp0cnVlLCJpYXQiOjE3NTcwNTYyMzQsImV4cCI6MTc1NzMxNTQzNH0.d6LX1hV_dTW5ZPLOchoj8df52VYrccG66wmsMiB1jKUf3DlbANd6fGyj_zFg7b_jV0d4s9Qd8qcAv_xcuFmrpw",
          empId: 2779524,
          firstName: "Rajarshi",
          lastName: "Manna",
          role: "Developer",
        },
      };

      if (response.message == "Success") {
        console.log("Sign up successful", data, response);
        onLogin(response);
        toast({
          title: "Account created successfully!",
          description: `Welcome to myTRAC, ${data.fullName}.`,
        });
        navigate("/app");
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
              <p className="text-xs text-destructive">
                {errors.employeeId.message}
              </p>
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
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>
        </div>

        {/* Second Row - role */}
        {/* <div className="grid grid-cols-2 gap-4"> */}

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <div className="relative">
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                placeholder="Select role"
                readOnly
                {...register("role", { required: "Please select a role" })}
                onClick={() => {
                  const dropdown = document.getElementById("role-dropdown");
                  dropdown?.classList.toggle("hidden");
                }}
              />
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-muted-foreground transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Custom Dropdown */}
              <div
                id="role-dropdown"
                className="hidden absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-50 max-h-60 overflow-auto"
              >
                {roleTypes.map((type) => (
                  <div
                    key={type}
                    className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors flex items-center gap-2"
                    onClick={() => {
                      const input = document.querySelector(
                        'input[name="role"]'
                      ) as HTMLInputElement;
                      if (input) {
                        input.value = type;
                        input.dispatchEvent(
                          new Event("input", { bubbles: true })
                        );
                      }
                      document
                        .getElementById("role-dropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    {/* <div className="w-2 h-2 rounded-full bg-primary"></div> */}
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>
        {/* </div> */}

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
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
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
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
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
