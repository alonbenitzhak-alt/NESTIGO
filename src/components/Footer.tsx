"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IV</span>
              </div>
              <span className="text-xl font-bold text-white">ISRAVEST</span>
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
              <li><Link href="/contact" className="hover:text-white transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.investmentCountries")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/countries/greece" className="hover:text-white transition-colors">{t("footer.greece")}</Link></li>
              <li><Link href="/countries/cyprus" className="hover:text-white transition-colors">{t("footer.cyprus")}</Link></li>
              <li><Link href="/countries/georgia" className="hover:text-white transition-colors">{t("footer.georgia")}</Link></li>
              <li><Link href="/countries/portugal" className="hover:text-white transition-colors">{t("footer.portugal")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@isravest.com" className="hover:text-white transition-colors">
                  info@isravest.com
                </a>
              </li>
              <li className="text-gray-400">{t("contact.office")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>{t("footer.disclaimer")}:</strong> {t("footer.disclaimerText")}
          </p>
          <p className="text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} ISRAVEST. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
