"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { useFavorites } from "@/lib/FavoritesContext";
import { useLanguage } from "@/lib/LanguageContext";

const COUNTRY_HE: Record<string, string> = {
  Greece: "יוון",
  Cyprus: "קפריסין",
  Georgia: "גאורגיה",
  Portugal: "פורטוגל",
};

function buildWhatsAppUrl(phone: string, title: string) {
  const msg = encodeURIComponent(`Hello, I'm interested in your property listing: ${title}`);
  const clean = phone.replace(/\s+/g, "");
  return `https://wa.me/${clean.startsWith("+") ? clean.slice(1) : clean}?text=${msg}`;
}

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, lang } = useLanguage();
  const favorited = isFavorite(property.id);
  const displayTitle = property.translations?.[lang]?.title ?? (lang === "he" ? property.title_he : undefined) ?? property.title;

  const countryHe = COUNTRY_HE[property.country] ?? property.country;
  const locationLabel = `${property.city}, ${countryHe}`;

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

        {/* ROI badge */}
        {property.expected_roi > 0 && (
          <div className="absolute top-3 end-3">
            <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {property.expected_roi}% תשואה ממוצעת
            </span>
          </div>
        )}

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
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {displayTitle}
        </h3>

        {/* City, Country in Hebrew */}
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {locationLabel}
        </p>

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
        <div className="flex items-center justify-between mb-3">
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

        {/* WhatsApp button */}
        {property.agent_whatsapp && (
          <a
            href={buildWhatsAppUrl(property.agent_whatsapp, displayTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            וואטסאפ למתווך
          </a>
        )}
      </div>
    </div>
  );
}
