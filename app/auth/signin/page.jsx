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
import * as Yup from "yup";

const LoginForm = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const response = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      router.push("/home");
    }
  };

  const handleGoogleLogin = async () => {
    const response = await signIn("google", { redirect: false });

    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      router.push("/home");
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardContent>
          <h2 className="text-2xl font-bold text-center text-gray-800 my-6">
            Login
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
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3"
              />
              {formik.touched.email && formik.errors.email && (
                <span color="red" className="text-sm text-red-700">
                  {formik.errors.email}
                </span>
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
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3"
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-sm text-red-700">
                  {formik.errors.password}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full"
            >
              Login with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-gray-600">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
