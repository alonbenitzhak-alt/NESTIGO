"use client";

import { ReactNode } from "react";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import { AuthProvider } from "@/lib/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AuthProvider>
  );
}
