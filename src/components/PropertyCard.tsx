"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { useFavorites } from "@/lib/FavoritesContext";

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-primary-700">
          {property.property_type}
        </div>
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {property.expected_roi}% ROI
        </div>
        <button
          onClick={() => toggleFavorite(property.id)}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className={`w-5 h-5 ${favorited ? "text-red-500 fill-red-500" : "text-gray-400"}`}
            fill={favorited ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.city}, {property.country}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            €{property.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </span>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="block text-center bg-primary-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
        >
          Request Investment Package
        </Link>
      </div>
    </div>
  );
}
