import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface SignupFormValues {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
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

  // Handle different data types
  if (formData instanceof FormData) {
    body = formData;
    // Don't set Content-Type for FormData, browser will set it with boundary
  } else if (typeof formData === "string") {
    body = formData;
    requestHeaders["Content-Type"] =
      requestHeaders["Content-Type"] || "text/plain";
  } else if (formData && typeof formData === "object") {
    body = JSON.stringify(formData);
    requestHeaders["Content-Type"] =
      requestHeaders["Content-Type"] || "application/json";
  }

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

// utils/validation.ts
export const validateSignupForm = (data: SignupFormValues) => {
  const errors: Partial<Record<keyof SignupFormValues, string>> = {};

  if (!data.employeeId || data.employeeId.length < 3) {
    errors.employeeId = "Employee ID must be at least 3 characters";
  }

  if (!data.fullName || data.fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.department || data.department.length < 1) {
    errors.department = "Please select a department";
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

// utils/validation.ts (add this function)
export const validateSigninForm = (data: {
  email: string;
  password: string;
}) => {
  const errors: Partial<Record<keyof typeof data, string>> = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password || data.password.length < 1) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
