"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { useLanguage, Lang } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/lib/types";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user, signOut, isAdmin, isAgent } = useAuth();
  const { favorites } = useFavorites();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifications(data);
    };
    fetchNotifs();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dashboardHref = isAgent ? "/dashboard/agent" : "/dashboard/buyer";

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/properties", label: t("nav.properties") },
    { href: "/countries", label: t("nav.countries") },
    { href: "/calculator", label: t("nav.calculator") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about", label: t("nav.about") },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="MANAIO" className="h-20 w-auto" loading="eager" />
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

              {/* Notifications Bell */}
              {user && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) markAllRead(); }}
                    className="relative text-gray-600 hover:text-primary-600 transition-colors"
                    aria-label={t("nav.notifications")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifs && (
                    <div className="absolute top-full mt-2 end-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm">{t("nav.notifications")}</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                            {t("notifications.markAllRead")}
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-gray-400">{t("notifications.empty")}</div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              href={n.link || "#"}
                              onClick={() => setShowNotifs(false)}
                              className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 ${!n.read ? "bg-primary-50/50" : ""}`}
                            >
                              <p className="text-sm font-medium text-gray-900">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {new Date(n.created_at).toLocaleDateString(lang === "he" ? "he-IL" : "en-US")}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="he">עב</option>
                <option value="en">EN</option>
                <option value="el">ΕΛ</option>
                <option value="ru">РУ</option>
                <option value="ar">ع</option>
              </select>

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
                href={isAgent ? "/dashboard/agent" : "/properties"}
                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                {isAgent ? (lang === "he" ? "הנכסים שלי" : "My Properties") : t("nav.browseInvestments")}
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
            <div className="px-3 py-2">
              <select
                value={lang}
                onChange={(e) => { setLang(e.target.value as Lang); setMobileOpen(false); }}
                className="w-full text-base font-medium text-primary-600 bg-primary-50 rounded-lg px-3 py-2 cursor-pointer outline-none border border-primary-100"
              >
                <option value="he">עברית</option>
                <option value="en">English</option>
                <option value="el">Ελληνικά</option>
                <option value="ru">Русский</option>
                <option value="ar">العربية</option>
              </select>
            </div>
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
                href={isAgent ? "/dashboard/agent" : "/properties"}
                className="block text-center bg-primary-600 text-white px-5 py-3.5 rounded-xl text-base font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {isAgent ? (lang === "he" ? "הנכסים שלי" : "My Properties") : t("nav.browseInvestments")}
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
