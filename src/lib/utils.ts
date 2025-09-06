import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface SignupFormValues {
  employeeId: string;
  fullName: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendApiRequest(
  url: string,
  formData: FormData | Record<string, any> | string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
  } = {}
) {
  const { method = "POST", headers = {} } = options;

  let body: FormData | string | undefined;
  let requestHeaders = { ...headers };

  const token = localStorage.getItem("token");
  if (token) requestHeaders["Authorization"] = `Bearer ${token}`;

  if (formData instanceof FormData) {
    body = formData;
  } else if (typeof formData === "string") {
    body = formData;  
    requestHeaders["Content-Type"] =
      requestHeaders["Content-Type"] || "text/plain";
  } else if (formData && typeof formData === "object") {
    body = JSON.stringify(formData);
    requestHeaders["Content-Type"] =
      requestHeaders["Content-Type"] || "application/json";
  }

  console.log(requestHeaders);
  console.log(body);
  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: method !== "GET" ? body : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export const validateSignupForm = (data: SignupFormValues) => {
  const errors: Partial<Record<keyof SignupFormValues, string>> = {};

  if (!data.employeeId || data.employeeId.length < 3) {
    errors.employeeId = "Employee ID must be at least 3 characters";
  }

  if (!data.fullName || data.fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!data.role || data.role.length < 1) {
    errors.role = "Please select a role";
  }

  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!data.confirmPassword || data.confirmPassword.length < 8) {
    errors.confirmPassword = "Please confirm your password";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSigninForm = (data: {
  empId: number;
  password: string;
}) => {
  const errors: Partial<Record<keyof typeof data, string>> = {};

  if (!data.password || data.password.length < 1) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
