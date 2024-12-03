"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

// Main Page Component (Handling Register and OTP)
export default function Page() {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSuccess = (email, password) => {
    setEmail(email);
    setPassword(password);
    setOtpSent(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardContent>
          {otpSent ? (
            <OtpVerification email={email} password={password} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Custom hook for form validation and submission
const useFormValidation = (initialValues, validationSchema, onSubmit) => {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setError(error.message || "Something went wrong");
      }
    },
  });

  return { formik, error };
};

// Register Form Component
const RegisterForm = ({ onSuccess }) => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      alert("OTP sent to your email.");
      onSuccess(values.email, values.password);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
  };

  const handleGoogleSignUp = async () => {
    const response = await signIn("google", { redirect: false });

    if (response?.error) {
      console.error("Google sign-up failed:", response.error);
    } else {
      alert("Google sign-up successful!");
      onSuccess(response.user.email, response.user.password);
    }
  };

  const { formik, error } = useFormValidation(
    { email: "", password: "" },
    validationSchema,
    handleSubmit
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-800 my-6">
        Create an Account
      </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium"
          >
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 text-sm">{formik.errors.email}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium"
          >
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3"
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-500 text-sm">
              {formik.errors.password}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full py-3 mt-4">
          Register
        </Button>
      </form>

      {/* Google Sign-Up Button */}
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={handleGoogleSignUp}
          className="w-full py-3 "
        >
          Sign Up with Google
        </Button>
      </div>

      <div className="mt-6 text-center text-gray-600">
        <span>Already have an account? </span>
        <Link
          href="/auth/signin"
          className="text-indigo-600 hover:text-indigo-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

// OTP Verification Component
const OtpVerification = ({ email, password }) => {
  const router = useRouter();

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(4, "OTP must be 4 characters")
      .required("OTP is required"),
  });

  const handleSubmit = async (values) => {
    const { otp } = values;

    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    if (response.ok) {
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then(() => {
        router.push("/home");
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid OTP.");
    }
  };

  const { formik } = useFormValidation(
    { otp: "" },
    validationSchema,
    handleSubmit
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 my-6">
        Verification code has been sent to your email.
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="otp"
            className="block text-gray-700 text-sm font-medium"
          >
            OTP
          </Label>
          <Input
            type="text"
            id="otp"
            name="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          {formik.touched.otp && formik.errors.otp && (
            <div className="text-red-500 text-sm">{formik.errors.otp}</div>
          )}
        </div>

        <Button type="submit" className="w-full py-3">
          Verify OTP
        </Button>
      </form>
    </div>
  );
};
