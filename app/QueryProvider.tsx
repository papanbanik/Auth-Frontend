"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContextProvider from "./context/AppContent";

export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        {children}
        <ToastContainer position="top-right" />
      </AppContextProvider>
    </QueryClientProvider>
  );
}
