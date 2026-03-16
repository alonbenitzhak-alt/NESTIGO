"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { useFavorites } from "@/lib/FavoritesContext";
import { useLanguage } from "@/lib/LanguageContext";

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, lang } = useLanguage();
  const favorited = isFavorite(property.id);
  const displayTitle = property.translations?.[lang]?.title ?? (lang === "he" ? property.title_he : undefined) ?? property.title;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 group hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.images[0]}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 start-3">
          <span className="bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-primary-700 shadow-sm">
            {t(`propertyType.${property.property_type.toLowerCase()}`) || property.property_type}
          </span>
        </div>

        <div className="absolute top-3 end-3">
          <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {property.expected_roi}% {t("card.roi")}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(property.id)}
          className="absolute bottom-3 end-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm hover:scale-110"
        >
          <svg
            className={`w-4.5 h-4.5 ${favorited ? "text-red-500 fill-red-500" : "text-gray-400"} transition-colors`}
            fill={favorited ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Country flag area */}
        <div className="absolute bottom-3 start-3">
          <span className="text-white/90 text-xs font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.city}, {property.country}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {displayTitle}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.bedrooms} {property.bedrooms === 1 ? t("card.bedroom") : t("card.bedrooms")}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {t("card.roi")} {property.expected_roi}%
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{t("card.price")}</p>
            <span className="text-2xl font-black text-gray-900">€{property.price.toLocaleString()}</span>
          </div>
          <Link
            href={`/properties/${property.id}`}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-200 active:scale-95"
          >
            {t("card.cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
