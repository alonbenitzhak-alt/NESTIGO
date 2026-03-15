"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Loading() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">{t("common.loading")}</p>
      </div>
    </div>
  );
}
