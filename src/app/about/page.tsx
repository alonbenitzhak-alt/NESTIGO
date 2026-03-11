"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

const team = [
  {
    name: { he: "אלון בן יצחק", en: "Alon Ben Yitzhak" },
    role: { he: "מייסד ומנכ\"ל", en: "Founder & CEO" },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: {
      he: "מעל 15 שנות ניסיון בנדל\"ן בינלאומי ושוקי השקעות באירופה.",
      en: "Over 15 years of experience in international real estate and European investment markets.",
    },
  },
  {
    name: { he: "מאיה לוי", en: "Maya Levi" },
    role: { he: "סמנכ\"לית פיתוח עסקי", en: "VP Business Development" },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    bio: {
      he: "מומחית בניתוח שווקים ואיתור הזדמנויות השקעה במדינות יעד.",
      en: "Expert in market analysis and identifying investment opportunities in target countries.",
    },
  },
  {
    name: { he: "דניאל כהן", en: "Daniel Cohen" },
    role: { he: "ראש מחלקת משפטית", en: "Head of Legal" },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: {
      he: "עו\"ד מומחה בעסקאות נדל\"ן בינלאומיות ומיסוי בין-לאומי.",
      en: "Attorney specializing in international real estate transactions and cross-border taxation.",
    },
  },
  {
    name: { he: "נועה אברהם", en: "Noa Avraham" },
    role: { he: "מנהלת קשרי לקוחות", en: "Client Relations Manager" },
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: {
      he: "מלווה את המשקיעים שלנו לאורך כל תהליך ההשקעה.",
      en: "Guides our investors throughout the entire investment process.",
    },
  },
];

const stats = [
  { value: "2019", labelHe: "שנת הקמה", labelEn: "Founded" },
  { value: "€50M+", labelHe: "השקעות שהושלמו", labelEn: "Investments Completed" },
  { value: "200+", labelHe: "משקיעים מרוצים", labelEn: "Happy Investors" },
  { value: "4", labelHe: "מדינות פעילות", labelEn: "Active Countries" },
];

export default function AboutPage() {
  const { t, lang } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{t("about.title")}</h1>
          <p className="text-lg text-primary-200 max-w-3xl mx-auto leading-relaxed">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.value} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-700">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{lang === "he" ? s.labelHe : s.labelEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t("about.missionTitle")}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{t("about.missionText")}</p>
          </div>
        </div>
      </section>

      {/* Why ISRAVEST */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{t("about.whyTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", titleKey: "about.why1Title", descKey: "about.why1Desc" },
              { icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", titleKey: "about.why2Title", descKey: "about.why2Desc" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", titleKey: "about.why3Title", descKey: "about.why3Desc" },
            ].map((item) => (
              <div key={item.titleKey} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t(item.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{t("about.teamTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name.en} className="text-center">
                <img
                  src={member.image}
                  alt={lang === "he" ? member.name.he : member.name.en}
                  className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-primary-100"
                />
                <h3 className="font-bold text-gray-900">{lang === "he" ? member.name.he : member.name.en}</h3>
                <p className="text-sm text-primary-600 font-medium mb-2">{lang === "he" ? member.role.he : member.role.en}</p>
                <p className="text-sm text-gray-500">{lang === "he" ? member.bio.he : member.bio.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("about.ctaTitle")}</h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">{t("about.ctaSubtitle")}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/properties" className="bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              {t("nav.browseInvestments")}
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
