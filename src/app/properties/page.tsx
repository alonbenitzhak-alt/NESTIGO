"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/lib/PropertiesContext";
import { useLanguage } from "@/lib/LanguageContext";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { properties } = useProperties();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    country: searchParams.get("country") || "",
    priceRange: searchParams.get("budget") || "",
    propertyType: "",
    minRoi: "",
    minBedrooms: "",
  });

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.country && p.country !== filters.country) return false;
      if (filters.propertyType && p.property_type !== filters.propertyType) return false;
      if (filters.priceRange) {
        const max = parseInt(filters.priceRange);
        if (p.price > max) return false;
      }
      if (filters.minRoi) {
        const min = parseFloat(filters.minRoi);
        if (p.expected_roi < min) return false;
      }
      if (filters.minBedrooms) {
        const min = parseInt(filters.minBedrooms);
        if (p.bedrooms < min) return false;
      }
      return true;
    });
  }, [filters, searchQuery]);

  const uniqueTypes = [...new Set(properties.map((p) => p.property_type))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("properties.search")}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t("properties.filter.country")}</label>
          <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="">{t("properties.filter.allCountries")}</option>
            <option value="Greece">{t("footer.greece")}</option>
            <option value="Cyprus">{t("footer.cyprus")}</option>
            <option value="Georgia">{t("footer.georgia")}</option>
            <option value="Portugal">{t("footer.portugal")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t("properties.filter.maxPrice")}</label>
          <select value={filters.priceRange} onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="">{t("properties.filter.anyPrice")}</option>
            <option value="100000">{t("properties.filter.upTo")} €100,000</option>
            <option value="200000">{t("properties.filter.upTo")} €200,000</option>
            <option value="350000">{t("properties.filter.upTo")} €350,000</option>
            <option value="500000">{t("properties.filter.upTo")} €500,000</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t("properties.filter.type")}</label>
          <select value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="">{t("properties.filter.allTypes")}</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{t(`propertyType.${type.toLowerCase()}`) || type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t("properties.filter.minRoi")}</label>
          <select value={filters.minRoi} onChange={(e) => setFilters({ ...filters, minRoi: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="">{t("properties.filter.anyRoi")}</option>
            <option value="7">7%+</option>
            <option value="8">8%+</option>
            <option value="10">10%+</option>
            <option value="12">12%+</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">{t("properties.filter.bedrooms")}</label>
          <select value={filters.minBedrooms} onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="">{t("properties.filter.any")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ country: "", priceRange: "", propertyType: "", minRoi: "", minBedrooms: "" })}
            className="w-full text-sm text-primary-600 font-semibold border border-primary-200 rounded-lg py-2.5 hover:bg-primary-50 transition-colors"
          >
            {t("properties.filter.clear")}
          </button>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-500">
        {t("properties.showing").replace("{count}", filtered.length.toString()).replace("{noun}", filtered.length === 1 ? t("properties.property") : t("properties.propertiesNoun"))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500 text-lg">{t("properties.noResults")}</p>
          <p className="text-gray-400 text-sm mt-1">{t("properties.noResultsSub")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filtered.map((p) => (<PropertyCard key={p.id} property={p} />))}
        </div>
      )}
    </div>
  );
}

function PropertiesPageHeader() {
  const { t } = useLanguage();
  const { properties } = useProperties();
  return (
    <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("properties.title")}</h1>
        <p className="text-primary-100 text-lg">
          {t("properties.subtitle").replace("{count}", properties.length.toString())}
        </p>
      </div>
    </section>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <PropertiesPageHeader />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">{/* loading */}</div>}>
        <PropertiesContent />
      </Suspense>
    </>
  );
}
