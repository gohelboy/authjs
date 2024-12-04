"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        {session ? (
          <div className="text-center">
            <Image
              width={56}
              height={56}
              src={session.user.image}
              alt="User Image"
              className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500"
            />
            <h1 className="text-2xl font-semibold text-gray-800 mt-4">
              Welcome, {session.user.name}!
            </h1>
            <p className="text-gray-600">{session.user.email}</p>
            <button
              onClick={() => signOut()}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome to My App
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to access your personalized dashboard.
            </p>
            <button
              onClick={() => router.push("/auth/signin")}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
