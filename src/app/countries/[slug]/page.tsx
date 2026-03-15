"use client";

import { useParams } from "next/navigation";
import { countries } from "@/data/countries";
import { useProperties } from "@/lib/PropertiesContext";
import { useLanguage } from "@/lib/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default function CountryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const country = countries.find((c) => c.slug === slug);
  const { properties } = useProperties();
  const { t, lang } = useLanguage();

  if (!country) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("countries.notFound")}</h1>
        <Link href="/countries" className="text-primary-600 hover:underline">{t("countries.backToCountries")}</Link>
      </div>
    );
  }

  if (country.comingSoon) {
    return (
      <>
        <section className="relative h-72 md:h-80 overflow-hidden">
          <img src={country.image} alt={country.name} className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="inline-block bg-gold-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              {lang === "he" ? "בקרוב" : "Coming Soon"}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{country.name}</h1>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {lang === "he" ? `נכסים ב${country.name} — בקרוב` : `Properties in ${country.name} — Coming Soon`}
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            {lang === "he"
              ? "אנחנו עובדים על הבאת נכסי השקעה איכותיים במדינה זו. הישארו מעודכנים."
              : "We're working on bringing quality investment properties in this country. Stay tuned."}
          </p>
          <Link href="/countries" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
            {t("countries.backToCountries")}
          </Link>
        </div>
      </>
    );
  }

  const countryProperties = properties.filter((p) => p.country === country.name);

  return (
    <>
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img src={country.image} alt={country.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {t("countries.investIn")} {country.name}
          </h1>
          <p className="text-white/80 text-lg">
            {countryProperties.length} {countryProperties.length === 1 ? t("properties.property") : t("properties.propertiesNoun")} {t("countries.available")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("countries.investmentOverview")}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{country.description}</p>
          <h3 className="font-bold text-gray-900 mb-3">{t("countries.keyHighlights")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {country.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-50 rounded-xl px-4 py-3">
                <svg className="w-5 h-5 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-800">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t("countries.propertiesIn")} {country.name}
        </h2>

        {countryProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg">{t("countries.noProperties").replace("{name}", country.name)}</p>
            <p className="text-gray-400 text-sm mt-1">{t("countries.checkBack")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countryProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
