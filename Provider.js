"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "./components/ui/toaster";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
