"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useEffect, useState, useCallback, ReactNode } from "react";
import SplashScreen from "@/components/SplashScreen";
import AIChatWidget from "@/components/AIChatWidget";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const { lang, dir } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang, dir]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
      <AIChatWidget />
    </>
  );
}
