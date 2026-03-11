"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    { num: "01", titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc" },
    { num: "02", titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc" },
    { num: "03", titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc" },
    { num: "04", titleKey: "howItWorks.step4.title", descKey: "howItWorks.step4.desc" },
    { num: "05", titleKey: "howItWorks.step5.title", descKey: "howItWorks.step5.desc" },
    { num: "06", titleKey: "howItWorks.step6.title", descKey: "howItWorks.step6.desc" },
  ];

  const faqKeys = [
    { qKey: "howItWorks.faq1.q", aKey: "howItWorks.faq1.a" },
    { qKey: "howItWorks.faq2.q", aKey: "howItWorks.faq2.a" },
    { qKey: "howItWorks.faq3.q", aKey: "howItWorks.faq3.a" },
    { qKey: "howItWorks.faq4.q", aKey: "howItWorks.faq4.a" },
  ];

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("howItWorks.title")}</h1>
          <p className="text-primary-100 text-lg">{t("howItWorks.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <div className="shrink-0 w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                {step.num}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(step.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("howItWorks.faq.title")}</h2>
          <div className="space-y-4">
            {faqKeys.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{t(faq.qKey)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(faq.aKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-primary-50 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("howItWorks.ctaTitle")}</h2>
          <p className="text-gray-600 mb-6">{t("howItWorks.ctaSubtitle")}</p>
          <Link href="/properties" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            {t("howItWorks.cta")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
