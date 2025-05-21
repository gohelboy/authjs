"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
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
          Get started
        </Button>
      </div>
      <p className="text-gray-400 mt-8 text-sm absolute bottom-3 text-center">To start using Spotinsight, <br /> Please DM me on <a className="text-white underline" href="https://instagram.com/gohelboy">@gohelboy</a>.</p>
    </div>
  );
}
