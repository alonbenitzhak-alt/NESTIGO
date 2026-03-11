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
        className={`transition-all duration-1000 ease-out ${
          phase === "logo"
            ? "scale-90 opacity-0"
            : "scale-100 opacity-100"
        }`}
        style={{
          animation: "logoEntry 0.8s ease-out forwards",
        }}
      >
        <img
          src="/logo.jpg"
          alt="ISRAVEST"
          className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Slogan */}
      <div
        className={`mt-8 text-center transition-all duration-1000 ease-out ${
          phase === "slogan" || phase === "fadeOut"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide">
          הדרך שלך להשקעות בעולם
        </p>
        <p className="mt-3 text-base sm:text-lg text-gray-400 font-light">
          Your Gateway to Global Real Estate
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

      <style jsx>{`
        @keyframes logoEntry {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          60% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
