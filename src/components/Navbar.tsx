"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { useLanguage } from "@/lib/LanguageContext";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, signOut, isAdmin, isAgent } = useAuth();
  const { favorites } = useFavorites();
  const { lang, setLang, t } = useLanguage();

  const dashboardHref = isAgent ? "/dashboard/agent" : "/dashboard/buyer";

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/properties", label: t("nav.properties") },
    { href: "/countries", label: t("nav.countries") },
    { href: "/calculator", label: t("nav.calculator") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="NESTIGO" className="h-20 w-auto" loading="eager" />
            </Link>

            <div className="hidden md:flex items-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Compare */}
              <Link
                href="/compare"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                aria-label={t("nav.compare")}
                title={t("nav.compare")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
              </Link>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="relative text-gray-600 hover:text-primary-600 transition-colors"
                aria-label={t("nav.favorites")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === "he" ? "en" : "he")}
                className="text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {lang === "he" ? "EN" : "עב"}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {t("nav.admin")}
                    </Link>
                  )}
                  <Link
                    href={dashboardHref}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {t("nav.signIn")}
                  </button>
                  <span className="text-gray-300">|</span>
                  <Link href="/register/buyer" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                    {lang === "he" ? "הרשמה" : "Register"}
                  </Link>
                </div>
              )}

              <Link
                href="/properties"
                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                {t("nav.browseInvestments")}
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg px-3 py-3"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/compare"
              className="block text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg px-3 py-3"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.compare")}
            </Link>
            <Link
              href="/favorites"
              className="block text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg px-3 py-3"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.favorites")} {favorites.length > 0 && `(${favorites.length})`}
            </Link>
            <button
              onClick={() => setLang(lang === "he" ? "en" : "he")}
              className="block w-full text-start text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg px-3 py-3"
            >
              {lang === "he" ? "Switch to English" : "עבור לעברית"}
            </button>
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="block text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg px-3 py-3"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("nav.dashboard")}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg px-3 py-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("nav.admin")}
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="block w-full text-start text-base font-medium text-red-500 hover:bg-red-50 rounded-lg px-3 py-3"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowLogin(true); setMobileOpen(false); }}
                  className="block w-full text-start text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg px-3 py-3"
                >
                  {t("nav.signIn")}
                </button>
                <Link
                  href="/register/buyer"
                  className="block text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg px-3 py-3"
                  onClick={() => setMobileOpen(false)}
                >
                  {lang === "he" ? "הרשמה כמשקיע" : "Register as Investor"}
                </Link>
                <Link
                  href="/register/agent"
                  className="block text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg px-3 py-3"
                  onClick={() => setMobileOpen(false)}
                >
                  {lang === "he" ? "הרשמה כסוכן" : "Register as Agent"}
                </Link>
              </>
            )}
            <div className="pt-2">
              <Link
                href="/properties"
                className="block text-center bg-primary-600 text-white px-5 py-3.5 rounded-xl text-base font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.browseInvestments")}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginForm onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}
