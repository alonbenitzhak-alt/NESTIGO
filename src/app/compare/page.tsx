"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useProperties } from "@/lib/PropertiesContext";
import { Property } from "@/lib/types";
import Link from "next/link";

export default function ComparePage() {
  const { t, lang } = useLanguage();
  const { properties } = useProperties();
  const activeProperties = properties.filter((p) => (p.status || "active") === "active");
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedProperties = selected
    .map((id) => activeProperties.find((p) => p.id === id))
    .filter(Boolean) as Property[];

  const filteredForSearch = activeProperties.filter(
    (p) =>
      !selected.includes(p.id) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addProperty = (id: string) => {
    if (selected.length < 3 && !selected.includes(id)) {
      setSelected([...selected, id]);
      setSearchQuery("");
    }
  };

  const removeProperty = (id: string) => {
    setSelected(selected.filter((s) => s !== id));
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("compare.title")}</h1>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">{t("compare.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Property Selector */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">{t("compare.selectProperties")} ({selected.length}/3)</h2>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProperties.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {p.title}
                  <button onClick={() => removeProperty(p.id)} className="hover:text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          {selected.length < 3 && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("compare.searchPlaceholder")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredForSearch.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addProperty(p.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0"
                    >
                      {p.images[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.city}, {p.country} · €{p.price.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                  {filteredForSearch.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-400">{t("compare.noResults")}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedProperties.length >= 2 ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-6 py-4 font-semibold text-gray-600 bg-gray-50 w-40"></th>
                    {selectedProperties.map((p) => (
                      <th key={p.id} className="px-6 py-4 min-w-[220px]">
                        <div className="text-center">
                          {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-32 rounded-xl object-cover mb-3" />}
                          <Link href={`/properties/${p.id}`} className="font-bold text-gray-900 hover:text-primary-600 line-clamp-2">
                            {p.title}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: t("compare.price"), render: (p: Property) => <span className="text-lg font-bold text-primary-700">€{p.price.toLocaleString()}</span> },
                    { label: t("compare.location"), render: (p: Property) => `${p.city}, ${p.country}` },
                    { label: t("compare.roi"), render: (p: Property) => <span className="text-lg font-bold text-accent-600">{p.expected_roi}%</span> },
                    { label: t("compare.type"), render: (p: Property) => p.property_type },
                    { label: t("compare.bedrooms"), render: (p: Property) => p.bedrooms },
                    { label: t("compare.monthlyRent"), render: (p: Property) => `€${Math.round((p.price * p.expected_roi) / 100 / 12).toLocaleString()}` },
                    { label: t("compare.annualIncome"), render: (p: Property) => `€${Math.round((p.price * p.expected_roi) / 100).toLocaleString()}` },
                    { label: t("compare.agent"), render: (p: Property) => p.agent_name },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-600 bg-gray-50">{row.label}</td>
                      {selectedProperties.map((p) => (
                        <td key={p.id} className="px-6 py-4 text-center text-gray-900">
                          {row.render(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Action row */}
                  <tr>
                    <td className="px-6 py-4 bg-gray-50"></td>
                    {selectedProperties.map((p) => (
                      <td key={p.id} className="px-6 py-4 text-center">
                        <Link
                          href={`/properties/${p.id}`}
                          className="inline-block bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                        >
                          {t("compare.viewProperty")}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("compare.selectAtLeast")}</h3>
            <p className="text-gray-500">{t("compare.selectAtLeastSub")}</p>
          </div>
        )}
      </div>
    </>
  );
}
