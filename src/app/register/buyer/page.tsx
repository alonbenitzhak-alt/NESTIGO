"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuyerRegisterPage() {
  const { signIn, signUp, user } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  if (user) {
    router.push("/dashboard/buyer");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "register") {
      if (!agreedToTerms) {
        setError(t("register.buyer.errorTerms"));
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, "buyer");
      if (error) setError(error);
      else {
        setSuccess(t("auth.checkEmail"));
        fetch("/api/welcome", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: email }) }).catch(() => null);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else router.push("/dashboard/buyer");
    }
    setLoading(false);
  };

  const benefits = [
    t("register.buyer.benefit1"),
    t("register.buyer.benefit2"),
    t("register.buyer.benefit3"),
    t("register.buyer.benefit4"),
    t("register.buyer.benefit5"),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 text-white p-16 flex-col justify-center">
        <div className="max-w-md">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {t("register.buyer.joinTitle")}
          </h1>
          <p className="text-primary-200 text-lg mb-10">
            {t("register.buyer.joinSubtitle")}
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
              {mode === "register" ? t("register.buyer.title") : t("auth.signIn")}
            </h2>
            <p className="text-gray-500 mt-2">
              {mode === "register" ? t("register.buyer.subtitle") : t("auth.signInDesc")}
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
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("form.emailPlaceholder")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("auth.passwordPlaceholder")} />
            </div>

            {/* Terms of Service — shown only on register mode */}
            {mode === "register" && (
              <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <input
                  type="checkbox"
                  id="terms-buyer"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="terms-buyer" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                  {t("register.buyer.termsAgree")}{" "}
                  <Link href="/terms" target="_blank" className="text-primary-600 font-semibold hover:underline">{t("register.buyer.terms")}</Link>
                  {" "}{t("register.buyer.termsAnd")}{" "}
                  <Link href="/privacy" target="_blank" className="text-primary-600 font-semibold hover:underline">{t("register.buyer.privacy")}</Link>
                  {" "}{t("register.buyer.termsOf")}
                </label>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-accent-600 text-sm">{success}</p>}

            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
              {loading ? t("auth.pleaseWait") : mode === "register" ? t("register.buyer.submit") : t("auth.signIn")}
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
            <Link href="/register/agent" className="text-sm text-gray-400 hover:text-primary-600 transition-colors">
              {t("register.buyer.agentLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
