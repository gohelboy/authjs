"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function Providers({ children }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
