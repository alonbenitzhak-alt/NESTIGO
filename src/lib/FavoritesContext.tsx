"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("isravest_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isravest_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
