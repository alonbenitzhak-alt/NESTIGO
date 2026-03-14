"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AgentRegisterPage() {
  const { signIn, signUp, user } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  if (user) {
    router.push("/dashboard/agent");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "register") {
      const { error } = await signUp(email, password, "agent");
      if (error) setError(error);
      else setSuccess(t("auth.checkEmail"));
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else router.push("/dashboard/agent");
    }
    setLoading(false);
  };

  const benefits = lang === "he"
    ? [
        "פרסום נכסים בפלטפורמה עם חשיפה למשקיעים ישראלים",
        "ניהול נכסים מלא - יצירה, עריכה ומחיקה",
        "קבלת לידים ישירות מהמשקיעים",
        "מעקב וניהול סטטוס פניות",
        "סטטיסטיקות ביצועים - צפיות, לחיצות והמרות",
        "ייצוא לידים ל-CSV",
      ]
    : [
        "List properties on a platform with exposure to Israeli investors",
        "Full property management - create, edit and delete",
        "Receive leads directly from investors",
        "Track and manage inquiry status",
        "Performance statistics - views, clicks and conversions",
        "Export leads to CSV",
      ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 to-primary-700 text-white p-16 flex-col justify-center">
        <div className="max-w-md">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {lang === "he" ? "הצטרפו כסוכנים" : "Join as an Agent"}
          </h1>
          <p className="text-primary-200 text-lg mb-10">
            {lang === "he"
              ? "פרסמו את הנכסים שלכם והגיעו למאות משקיעים ישראלים שמחפשים הזדמנויות בחו\"ל."
              : "List your properties and reach hundreds of Israeli investors looking for international opportunities."}
          </p>
          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-primary-100">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.svg" alt="MANAIO" className="h-16 w-auto mx-auto" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "register"
                ? (lang === "he" ? "הרשמה כסוכן נדל\"ן" : "Register as Agent")
                : t("auth.signIn")}
            </h2>
            <p className="text-gray-500 mt-2">
              {mode === "register"
                ? (lang === "he" ? "צרו חשבון והתחילו לפרסם נכסים" : "Create an account and start listing properties")
                : t("auth.signInDesc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.name")}</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("form.namePlaceholder")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.phone")}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("form.phonePlaceholder")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {lang === "he" ? "שם חברה" : "Company Name"}
                  </label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={lang === "he" ? "שם החברה שלכם" : "Your company name"} />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("form.emailPlaceholder")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("auth.passwordPlaceholder")} />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-accent-600 text-sm">{success}</p>}

            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
              {loading ? t("auth.pleaseWait") : mode === "register" ? (lang === "he" ? "הרשמה כסוכן" : "Register as Agent") : t("auth.signIn")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === "register" ? (
              <>
                {t("auth.hasAccount")}{" "}
                <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-primary-600 font-semibold hover:underline">{t("auth.signIn")}</button>
              </>
            ) : (
              <>
                {t("auth.noAccount")}{" "}
                <button onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="text-primary-600 font-semibold hover:underline">{t("auth.signUp")}</button>
              </>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link href="/register/buyer" className="text-sm text-gray-400 hover:text-primary-600 transition-colors">
              {lang === "he" ? "משקיע? הירשמו כאן →" : "Investor? Register here →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
