"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-4xl font-semibold text-green-500 mb-6">
          Spotinsight
        </h1>
        <p className="text-gray-400 mb-8">
          Your personalized Spotify insights at your fingertips.
        </p>
        <Button
          size="lg"
          onClick={() => router.push("/auth/signin")}
          className="w-full py-3 text-lg font-semibold rounded-lg shadow-md bg-white text-gray-900 hover:text-white"
        >
          Login to Continue
        </Button>
      </div>
    </div>
  );
}
