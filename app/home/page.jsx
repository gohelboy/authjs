"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { data: session, status } = useSession();

  // Show loading state while session data is being fetched
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <h1 className="text-xl font-semibold ">Loading...</h1>
      </div>
    );
  }

  // If the user is not logged in, show a message
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Not Logged In
          </h1>
          <h1 className="">
            You are not logged in. Please log in to access your account.
          </h1>
        </div>
      </div>
    );
  }

  // If the user is logged in, display user details
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-lg p-8">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <Image
            src={session.user.image || "/default-profile.png"}
            alt="Profile Image"
            width={100}
            height={100}
            className="border-2 border-primary rounded-full"
          />
        </div>

        {/* User Information */}
        <h1 className="text-3xl font-semibold text-foreground text-center mb-6">
          Welcome, {session.user.name || session.user.email}!
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-muted p-4 rounded-lg shadow-sm">
            <h1 className="text-lg text-foreground">Email:</h1>
            <h1 className="text-lg ">{session.user.email}</h1>
          </div>
          <div className="flex justify-between items-center bg-muted p-4 rounded-lg shadow-sm">
            <h1 className="text-lg text-foreground">Session ID:</h1>
            <h1 className="text-lg ">{session.id}</h1>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => signOut()}
            className="w-full bg-primary hover:bg-primary-focus text-white rounded-lg"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
