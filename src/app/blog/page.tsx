"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

// Static blog posts for now (can be migrated to Supabase later)
const blogPosts = [
  {
    id: "1",
    slug: "guide-to-investing-in-greek-real-estate",
    title: { he: "מדריך להשקעת נדל\"ן ביוון 2025", en: "Guide to Investing in Greek Real Estate 2025" },
    excerpt: {
      he: "יוון מציעה הזדמנויות השקעה ייחודיות עם תוכנית הגולדן ויזה, תשואות אטרקטיביות ותיירות צומחת. למדו כיצד להתחיל.",
      en: "Greece offers unique investment opportunities with the Golden Visa program, attractive yields, and growing tourism. Learn how to get started.",
    },
    cover: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=400&fit=crop",
    category: { he: "מדריכים", en: "Guides" },
    author: "ISRAVEST",
    date: "2025-03-01",
    readTime: 8,
  },
  {
    id: "2",
    slug: "tax-benefits-international-real-estate",
    title: { he: "הטבות מס בהשקעות נדל\"ן בחו\"ל למשקיעים ישראלים", en: "Tax Benefits of International Real Estate for Israeli Investors" },
    excerpt: {
      he: "סקירת הטבות המס העיקריות עבור ישראלים המשקיעים בנדל\"ן בחו\"ל, כולל אמנות מס ותכנון מס חכם.",
      en: "Overview of key tax benefits for Israelis investing in overseas real estate, including tax treaties and smart tax planning.",
    },
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    category: { he: "מיסוי", en: "Taxation" },
    author: "ISRAVEST",
    date: "2025-02-15",
    readTime: 6,
  },
  {
    id: "3",
    slug: "georgia-emerging-market-opportunity",
    title: { he: "גאורגיה: שוק מתפתח עם תשואות דו-ספרתיות", en: "Georgia: Emerging Market with Double-Digit Returns" },
    excerpt: {
      he: "גאורגיה הפכה ליעד השקעה פופולרי עם תשואות שמגיעות ל-14% ומעלה. מה עומד מאחורי הצמיחה?",
      en: "Georgia has become a popular investment destination with yields reaching 14% and above. What's driving the growth?",
    },
    cover: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=400&fit=crop",
    category: { he: "ניתוח שוק", en: "Market Analysis" },
    author: "ISRAVEST",
    date: "2025-02-01",
    readTime: 7,
  },
  {
    id: "4",
    slug: "portugal-nhr-program-explained",
    title: { he: "תוכנית NHR בפורטוגל - כל מה שצריך לדעת", en: "Portugal's NHR Program - Everything You Need to Know" },
    excerpt: {
      he: "תוכנית התושבות הלא-רגילה של פורטוגל מציעה הטבות מס משמעותיות. האם היא מתאימה לכם?",
      en: "Portugal's Non-Habitual Residency program offers significant tax benefits. Is it right for you?",
    },
    cover: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=400&fit=crop",
    category: { he: "מדריכים", en: "Guides" },
    author: "ISRAVEST",
    date: "2025-01-20",
    readTime: 10,
  },
  {
    id: "5",
    slug: "cyprus-residency-through-investment",
    title: { he: "תושבות בקפריסין דרך השקעה בנדל\"ן", en: "Cyprus Residency Through Real Estate Investment" },
    excerpt: {
      he: "קפריסין מציעה נתיב ישיר לתושבות אירופאית דרך השקעת נדל\"ן. סקירת התנאים והיתרונות.",
      en: "Cyprus offers a direct path to European residency through real estate investment. Overview of conditions and benefits.",
    },
    cover: "https://images.unsplash.com/photo-1580227974546-fbd48825d991?w=800&h=400&fit=crop",
    category: { he: "תושבות", en: "Residency" },
    author: "ISRAVEST",
    date: "2025-01-10",
    readTime: 5,
  },
  {
    id: "6",
    slug: "5-mistakes-first-time-international-investors",
    title: { he: "5 טעויות נפוצות של משקיעי נדל\"ן מתחילים בחו\"ל", en: "5 Common Mistakes First-Time International Real Estate Investors Make" },
    excerpt: {
      he: "השקעת נדל\"ן בחו\"ל יכולה להיות מורכבת. הנה 5 טעויות שכדאי להימנע מהן.",
      en: "International real estate investing can be complex. Here are 5 mistakes you should avoid.",
    },
    cover: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&h=400&fit=crop",
    category: { he: "טיפים", en: "Tips" },
    author: "ISRAVEST",
    date: "2024-12-28",
    readTime: 6,
  },
];

const categories = [
  { he: "הכל", en: "All" },
  { he: "מדריכים", en: "Guides" },
  { he: "מיסוי", en: "Taxation" },
  { he: "ניתוח שוק", en: "Market Analysis" },
  { he: "תושבות", en: "Residency" },
  { he: "טיפים", en: "Tips" },
];

export default function BlogPage() {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All" || selectedCategory === "הכל"
    ? blogPosts
    : blogPosts.filter((p) => p.category[lang] === selectedCategory);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("blog.title")}</h1>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">{t("blog.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const label = lang === "he" ? cat.he : cat.en;
            return (
              <button
                key={cat.en}
                onClick={() => setSelectedCategory(label)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === label
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative overflow-hidden">
                <img
                  src={post.cover}
                  alt={lang === "he" ? post.title.he : post.title.en}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {lang === "he" ? post.category.he : post.category.en}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>{new Date(post.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span>·</span>
                  <span>{post.readTime} {t("blog.minRead")}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {lang === "he" ? post.title.he : post.title.en}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {lang === "he" ? post.excerpt.he : post.excerpt.en}
                </p>
                <span className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  {t("blog.readMore")} →
                </span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">{t("blog.noArticles")}</p>
          </div>
        )}
      </div>
    </>
  );
}
