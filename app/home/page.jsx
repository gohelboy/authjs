"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Page = () => {
  const { data: session, status } = useSession();

  // Show loading state while session data is being fetched
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  // If the user is not logged in, show a message
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Not Logged In
          </h2>
          <p className="text-gray-600">
            You are not logged in. Please log in to access your account.
          </p>
        </div>
      </div>
    );
  }

  // If the user is logged in, display user details
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <Image
            src={session.user.image || "/default-profile.png"}
            alt="Profile Image"
            width={100}
            height={100}
            className="rounded-full border-4 border-indigo-600"
          />
        </div>

        {/* User Information */}
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Welcome, {session.user.name || session.user.email}!
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="text-lg text-gray-700">Email:</span>
            <span className="text-lg text-gray-500">{session.user.email}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="text-lg text-gray-700">Session ID:</span>
            <span className="text-lg text-gray-500">{session.id}</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signOut()}
            className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
