"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

export default function LoginForm({ onClose }: { onClose?: () => void }) {
  const { signIn } = useAuth();
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) setError(error);
    else onClose?.();
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 max-w-md w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{t("auth.signIn")}</h2>
      <p className="text-sm text-gray-500 mb-6">{t("auth.signInDesc")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder={t("form.emailPlaceholder")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder={t("auth.passwordPlaceholder")} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
          {loading ? t("auth.pleaseWait") : t("auth.signIn")}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="text-sm text-gray-500 text-center mb-3">
          {t("auth.noAccount")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/register/buyer"
            onClick={() => onClose?.()}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-center"
          >
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{lang === "he" ? "הרשמה כמשקיע" : "As Investor"}</span>
          </Link>
          <Link
            href="/register/agent"
            onClick={() => onClose?.()}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-center"
          >
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{lang === "he" ? "הרשמה כסוכן" : "As Agent"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
