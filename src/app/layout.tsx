import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { LayoutWrapper } from "./layout-wrapper";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mymanaio.com";

export const metadata: Metadata = {
  title: {
    default: "MANAIO - השקעות נדל\"ן בחו\"ל למשקיעים ישראלים",
    template: "%s | MANAIO",
  },
  description:
    "פלטפורמת ההשקעות המובילה לנדל\"ן בחו\"ל. השקיעו בנכסים ביוון, קפריסין, גאורגיה ופורטוגל עם ליווי מומחים, מחשבון תשואה ותמחור שקוף.",
  keywords: [
    "השקעות נדל\"ן", "נדל\"ן בחו\"ל", "השקעות ביוון", "דירה בקפריסין",
    "נדל\"ן גאורגיה", "נדל\"ן פורטוגל", "השקעות נדל\"ן לישראלים",
    "תשואה על נדל\"ן", "real estate investment", "MANAIO",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "he_IL",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "MANAIO",
    title: "MANAIO - השקעות נדל\"ן בחו\"ל למשקיעים ישראלים",
    description: "פלטפורמת ההשקעות המובילה לנדל\"ן בחו\"ל. נכסים ביוון, קפריסין, גאורגיה ופורטוגל.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MANAIO - השקעות נדל\"ן גלובליות",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MANAIO - השקעות נדל\"ן בחו\"ל",
    description: "פלטפורמת ההשקעות המובילה לנדל\"ן בחו\"ל למשקיעים ישראלים",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "MANAIO",
              description: "פלטפורמת השקעות נדל\"ן בינלאומית למשקיעים ישראלים",
              url: SITE_URL,
              areaServed: ["Greece", "Cyprus", "Georgia", "Portugal"],
              serviceType: "Real Estate Investment Platform",
            }),
          }}
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <LayoutWrapper>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
