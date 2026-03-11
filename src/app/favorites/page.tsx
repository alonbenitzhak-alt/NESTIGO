"use client";

import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { useFavorites } from "@/lib/FavoritesContext";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Favorites</h1>
          <p className="text-primary-100 text-lg">
            {favorites.length} saved {favorites.length === 1 ? "property" : "properties"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {favoriteProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No favorites yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Browse properties and click the heart icon to save them</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
