"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/lib/PropertiesContext";
import { countries } from "@/data/countries";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const { properties } = useProperties();
  const [search, setSearch] = useState({ country: "", city: "", budget: "", propertyType: "", minBedrooms: "", minRoi: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80",
    "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1920&q=80",
    "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=80",
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920&q=80",
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const featured = properties.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.country) params.set("country", search.country);
    if (search.budget) params.set("budget", search.budget);
    if (search.city) params.set("city", search.city);
    if (search.propertyType) params.set("type", search.propertyType);
    if (search.minBedrooms) params.set("minBedrooms", search.minBedrooms);
    if (search.minRoi) params.set("minRoi", search.minRoi);
    router.push(`/properties?${params.toString()}`);
  };

  const steps = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: t("home.steps.browse.title"),
      desc: t("home.steps.browse.desc"),
      color: "from-blue-500 to-primary-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: t("home.steps.request.title"),
      desc: t("home.steps.request.desc"),
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t("home.steps.consult.title"),
      desc: t("home.steps.consult.desc"),
      color: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("home.steps.invest.title"),
      desc: t("home.steps.invest.desc"),
      color: "from-amber-500 to-gold-600",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  ];

  const stats = [
    {
      value: "4",
      label: t("home.stats.countries"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
    },
    {
      value: "50+",
      label: t("home.stats.properties"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      value: "12%",
      label: t("home.stats.avgRoi"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      value: "€68K",
      label: t("home.stats.startingFrom"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Rotating background images */}
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url('${src}')`, opacity: i === heroIdx ? 1 : 0 }}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 drop-shadow-lg" style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}>
              שוק הנדל&quot;ן הבינלאומי לישראלים
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl">
              {t("home.hero.subtitle")}
            </p>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2 mb-8">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? "bg-white w-6" : "bg-white/40"}`}
              />
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} dir={dir} className="bg-white rounded-2xl p-4 md:p-5 shadow-xl shadow-black/25 max-w-4xl">
            {/* Main row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("home.search.country")}</label>
                <select
                  value={search.country}
                  onChange={(e) => setSearch({ ...search, country: e.target.value })}
                  className="w-full text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                >
                  <option value="">{t("home.search.allCountries")}</option>
                  <option value="Greece">{t("home.search.country.Greece")}</option>
                  <option value="Cyprus">{t("home.search.country.Cyprus")}</option>
                  <option value="Georgia">{t("home.search.country.Georgia")}</option>
                  <option value="Portugal">{t("home.search.country.Portugal")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("home.search.city")}</label>
                <input
                  type="text"
                  placeholder={t("home.search.anyCity")}
                  value={search.city}
                  onChange={(e) => setSearch({ ...search, city: e.target.value })}
                  className="w-full text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("home.search.budget")}</label>
                <select
                  value={search.budget}
                  onChange={(e) => setSearch({ ...search, budget: e.target.value })}
                  className="w-full text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                >
                  <option value="">{t("home.search.anyBudget")}</option>
                  <option value="100000">{t("home.search.upTo")} €100,000</option>
                  <option value="250000">{t("home.search.upTo")} €250,000</option>
                  <option value="500000">{t("home.search.upTo")} €500,000</option>
                  <option value="1000000">{t("home.search.upTo")} €1,000,000</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors"
                >
                  {t("home.search.button")}
                </button>
              </div>
            </div>

            {/* Advanced filters toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors"
              >
                <svg className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showAdvanced ? t("home.search.hideAdvanced") : t("home.search.advanced")}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("home.search.propertyType")}</label>
                    <select
                      value={search.propertyType}
                      onChange={(e) => setSearch({ ...search, propertyType: e.target.value })}
                      className="w-full text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                    >
                      <option value="">{t("home.search.anyType")}</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Studio">Studio</option>
                      <option value="Condo">Condo</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("home.search.minBedrooms")}</label>
                    <select
                      value={search.minBedrooms}
                      onChange={(e) => setSearch({ ...search, minBedrooms: e.target.value })}
                      className="w-full text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                    >
                      <option value="">{t("home.search.anyBedrooms")}</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("home.search.minRoi")}</label>
                    <select
                      value={search.minRoi}
                      onChange={(e) => setSearch({ ...search, minRoi: e.target.value })}
                      className="w-full text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                    >
                      <option value="">{t("home.search.anyRoi")}</option>
                      <option value="5">5%+</option>
                      <option value="8">8%+</option>
                      <option value="10">10%+</option>
                      <option value="12">12%+</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200 rtl:divide-x-reverse">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 px-6 py-2">
              <div className="text-primary-600 mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{stat.value}</div>
              <div className="text-xs text-gray-500 text-center">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-sm text-primary-600 font-medium mb-3 border border-primary-200 bg-primary-50 px-4 py-1 rounded-full">
            {t("home.featured.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}>{t("home.featured.title")}</h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            {t("home.featured.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            {t("home.featured.browseAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-sm text-primary-600 font-medium mb-3 border border-primary-200 bg-white px-4 py-1 rounded-full">
              {t("home.howItWorks.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}>{t("home.howItWorks.title")}</h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              {t("home.howItWorks.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-xl p-6 border border-stone-200 hover:border-primary-200 transition-colors">
                <div className="absolute top-4 end-4 w-6 h-6 rounded-full bg-stone-100 text-stone-400 text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className={`w-12 h-12 ${step.bg} ${step.text} rounded-xl flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <div className={`text-xs font-medium ${step.text} mb-1`}>
                  {t("home.howItWorks.step")} {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-sm text-primary-600 font-medium mb-3 border border-primary-200 bg-primary-50 px-4 py-1 rounded-full">
            {t("home.countries.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}>{t("home.countries.title")}</h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            {t("home.countries.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {countries.map((c) => (
            <Link
              key={c.slug}
              href={`/countries/${c.slug}`}
              className="group relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-3 start-3">
                <span className="bg-black/30 text-white text-xs px-2.5 py-1 rounded-full">
                  {properties.filter((p) => p.country === c.name).length} {t("home.countries.properties")}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg">{c.name}</h3>
                <div className="text-white/75 text-sm mt-0.5 group-hover:text-white transition-colors">
                  {t("home.countries.explore")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-700 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-primary-200 mb-6">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t("home.cta.badge")}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-snug" style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}>
            {t("home.cta.title")}
          </h2>
          <p className="text-primary-200 text-base mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-800 px-7 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              {t("home.cta.button")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/register/agent"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-7 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              {t("home.cta.agentButton")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
