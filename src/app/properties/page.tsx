"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    country: searchParams.get("country") || "",
    priceRange: searchParams.get("budget") || "",
    propertyType: "",
    minRoi: "",
    minBedrooms: "",
  });

  const filtered = useMemo(() => {
    return properties.filter((p) => {
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
  }, [filters]);

  const uniqueTypes = [...new Set(properties.map((p) => p.property_type))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Country</label>
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="">All Countries</option>
            <option value="Greece">Greece</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Georgia">Georgia</option>
            <option value="Portugal">Portugal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Max Price</label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="">Any Price</option>
            <option value="100000">Up to €100,000</option>
            <option value="200000">Up to €200,000</option>
            <option value="350000">Up to €350,000</option>
            <option value="500000">Up to €500,000</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Min ROI</label>
          <select
            value={filters.minRoi}
            onChange={(e) => setFilters({ ...filters, minRoi: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="">Any ROI</option>
            <option value="7">7%+</option>
            <option value="8">8%+</option>
            <option value="10">10%+</option>
            <option value="12">12%+</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Bedrooms</label>
          <select
            value={filters.minBedrooms}
            onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="">Any</option>
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
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 text-sm text-gray-500">
        Showing {filtered.length} {filtered.length === 1 ? "property" : "properties"}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500 text-lg">No properties match your filters</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Investment Properties</h1>
          <p className="text-primary-100 text-lg">
            Explore {properties.length} curated properties across 4 countries
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
            Loading properties...
          </div>
        }
      >
        <PropertiesContent />
      </Suspense>
    </>
  );
}
