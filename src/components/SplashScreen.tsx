"use client";

import { useState, useEffect } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"logo" | "slogan" | "fadeOut">("logo");

  useEffect(() => {
    // Logo appears immediately, then show slogan after 800ms
    const sloganTimer = setTimeout(() => setPhase("slogan"), 800);
    // Start fade out after 2.5s
    const fadeTimer = setTimeout(() => setPhase("fadeOut"), 2500);
    // Remove splash after fade completes
    const doneTimer = setTimeout(() => onFinish(), 3300);

    return () => {
      clearTimeout(sloganTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ${
        phase === "fadeOut" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div
        style={{
          animation: "logoEntry 0.8s ease-out forwards",
        }}
      >
        <img
          src="/logo.svg"
          alt="MANAIO"
          className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Hebrew Tagline */}
      <div
        className={`mt-6 text-center transition-all duration-1000 ease-out ${
          phase === "slogan" || phase === "fadeOut"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-wide" dir="rtl">
          הבית הישראלי לנדל&quot;ן בחו&quot;ל
        </p>
      </div>

      {/* Subtle loading dots */}
      <div
        className={`absolute bottom-12 flex gap-2 transition-opacity duration-500 ${
          phase === "fadeOut" ? "opacity-0" : "opacity-60"
        }`}
      >
        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

    </div>
  );
}
