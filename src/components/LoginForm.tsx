"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import type { UserRole } from "@/lib/types";

export default function LoginForm({ onClose }: { onClose?: () => void }) {
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<UserRole>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else onClose?.();
    } else {
      const { error } = await signUp(email, password, role);
      if (error) setError(error);
      else setSuccess(t("auth.checkEmail"));
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 max-w-md w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {mode === "login" ? t("auth.signInDesc") : t("auth.signUpDesc")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("auth.accountType")}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "buyer"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-semibold">{t("auth.buyer")}</span>
                <span className="text-[11px] text-gray-400">{t("auth.buyerDesc")}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("agent")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "agent"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-semibold">{t("auth.agent")}</span>
                <span className="text-[11px] text-gray-400">{t("auth.agentDesc")}</span>
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder={t("form.emailPlaceholder")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder={t("auth.passwordPlaceholder")} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-accent-600 text-sm">{success}</p>}
        <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
          {loading ? t("auth.pleaseWait") : mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        {mode === "login" ? (
          <>{t("auth.noAccount")} <button onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="text-primary-600 font-semibold hover:underline">{t("auth.signUp")}</button></>
        ) : (
          <>{t("auth.hasAccount")} <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-primary-600 font-semibold hover:underline">{t("auth.signIn")}</button></>
        )}
      </div>
    </div>
  );
}
