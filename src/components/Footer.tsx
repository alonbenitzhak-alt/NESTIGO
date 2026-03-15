"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-white">MANAIO</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-white transition-colors">{t("nav.properties")}</Link></li>
              <li><Link href="/countries" className="hover:text-white transition-colors">{t("nav.countries")}</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">{t("nav.calculator")}</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">{t("nav.compare")}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{t("nav.blog")}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t("nav.about")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.investmentCountries")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/countries/greece" className="hover:text-white transition-colors">{t("footer.greece")}</Link></li>
              <li><Link href="/countries/cyprus" className="hover:text-white transition-colors">{t("footer.cyprus")}</Link></li>
              <li>
                <span className="text-gray-500 cursor-default">
                  {t("footer.georgia")} <span className="text-xs text-gold-500">({lang === "he" ? "בקרוב" : "Soon"})</span>
                </span>
              </li>
              <li>
                <span className="text-gray-500 cursor-default">
                  {t("footer.portugal")} <span className="text-xs text-gold-500">({lang === "he" ? "בקרוב" : "Soon"})</span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@mymanaio.com" className="hover:text-white transition-colors">
                  info@mymanaio.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>{t("footer.disclaimer")}:</strong> {t("footer.disclaimerText")}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} MANAIO. {t("footer.rights")}
            </p>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">
              {t("footer.privacy") || "מדיניות פרטיות"}
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
              {t("footer.terms") || "תנאי שימוש"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
