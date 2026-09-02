"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useInitiatives } from "@/lib/useInitiatives";

type InitiativesContextValue = ReturnType<typeof useInitiatives>;

const InitiativesContext = createContext<InitiativesContextValue | null>(null);

export function InitiativesProvider({ children }: { children: ReactNode }) {
  const value = useInitiatives();
  return (
    <InitiativesContext.Provider value={value}>{children}</InitiativesContext.Provider>
  );
}

export function useInitiativesContext(): InitiativesContextValue {
  const ctx = useContext(InitiativesContext);
  if (!ctx) {
    throw new Error("useInitiativesContext must be used within InitiativesProvider");
  }
  return ctx;
}
