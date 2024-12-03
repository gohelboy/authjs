"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  // Validation schema for login form
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Form submission logic for email/password login
  const handleSubmit = async (values) => {
    const response = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (response?.error) {
      setError(response.error); // Show error if login failed
    } else {
      router.push("/home"); // Redirect to home page on successful login
      alert("Login successful.");
    }
  };

  // Google login logic
  const handleGoogleLogin = async () => {
    const response = await signIn("google", { redirect: false });

    if (response?.error) {
      setError(response.error); // Show error if Google login fails
    } else {
      router.push("/home"); // Redirect to home page on successful login
      alert("Google login successful.");
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
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
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Login with Google
          </button>
        </div>

        <div className="mt-6 text-center text-gray-600">
          <span>Don't have an account? </span>
          <a
            href="/auth/signup"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
