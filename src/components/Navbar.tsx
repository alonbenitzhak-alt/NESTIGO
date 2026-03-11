"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useFavorites } from "@/lib/FavoritesContext";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();

  const links = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/countries", label: "Countries" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ISRAVEST</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/favorites"
                className="relative text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Favorites"
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

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </button>
              )}

              <Link
                href="/properties"
                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Investments
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
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/favorites"
              className="block text-sm font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setMobileOpen(false)}
            >
              Favorites {favorites.length > 0 && `(${favorites.length})`}
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="block text-sm font-medium text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="block text-sm font-medium text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowLogin(true); setMobileOpen(false); }}
                className="block text-sm font-medium text-primary-600"
              >
                Sign In
              </button>
            )}
            <Link
              href="/properties"
              className="block text-center bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Browse Investments
            </Link>
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
