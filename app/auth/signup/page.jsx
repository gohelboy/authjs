"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        {otpSent ? (
          <OtpVerification email={email} password={password} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}

const useFormValidation = (initialValues, validationSchema, onSubmit) => {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        setError(error.message || "Something went wrong");
      }
    },
  });

  return { formik, error };
};

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
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create an Account
      </h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </form>

      {/* Google Sign-Up Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleGoogleSignUp}
          className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Up with Google
        </button>
      </div>

      <div className="mt-6 text-center text-gray-600">
        <span>Already have an account? </span>
        <a
          href="/auth/signin"
          className="text-indigo-600 hover:text-indigo-700"
        >
          Sign In
        </a>
      </div>
    </div>
  );
};

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

  const { formik, error } = useFormValidation(
    { otp: "" },
    validationSchema,
    handleSubmit
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Verify OTP
      </h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-gray-700">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formik.touched.otp && formik.errors.otp && (
            <div className="text-red-500 text-sm">{formik.errors.otp}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};
