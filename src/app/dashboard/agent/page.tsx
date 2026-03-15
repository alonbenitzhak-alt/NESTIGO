"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Property, Lead, LeadStatus, Conversation, Message } from "@/lib/types";
import LoginForm from "@/components/LoginForm";
import ChatWindow from "@/components/ChatWindow";
import Link from "next/link";

type Tab = "properties" | "leads" | "chats" | "stats" | "profile";

interface ConversationWithDetails extends Conversation {
  buyer_name: string;
  buyer_email: string;
  property_title: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
}

const statusColors: Record<LeadStatus, string> = {
  sent: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  answered: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, Record<LeadStatus, string>> = {
  he: { sent: "נשלח", in_progress: "בטיפול", answered: "נענה", closed: "סגור" },
  en: { sent: "Sent", in_progress: "In Progress", answered: "Answered", closed: "Closed" },
};

const AMENITIES_LIST = ["חניה", "מרפסת", "בריכה", "מעלית", "מחסן", "מאובזר", "נוף לים", "גינה", "מכון כושר", "שומר"];
const PROPERTY_TYPES = ["Apartment", "Land", "Detached House", "Villa", "Maisonette", "Apartment Complex"];
const CURRENCIES = ["EUR", "USD", "GBP", "ILS"] as const;

/* ─────── Property Form ─────── */
function AgentPropertyForm({
  property,
  onSave,
  onCancel,
  agentId,
}: {
  property?: Property;
  onSave: (data: Omit<Property, "id"> & { id?: string }) => void;
  onCancel: () => void;
  agentId: string;
}) {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({
    title: property?.title || "",
    country: property?.country || "Greece",
    city: property?.city || "",
    neighborhood: property?.neighborhood || "",
    price: property?.price || 0,
    currency: (property?.currency || "EUR") as typeof CURRENCIES[number],
    show_roi: property?.show_roi ?? true,
    expected_roi: property?.expected_roi || 0,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area_sqm: property?.area_sqm || 0,
    floor: property?.floor ?? ("" as string | number),
    year_built: property?.year_built ?? ("" as string | number),
    property_type: property?.property_type || "Apartment",
    description: property?.description || "",
    amenities: property?.amenities || [] as string[],
    furnished: property?.furnished || false,
  });

  // Image upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(property?.images || []);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [uploading, setUploading] = useState(false);

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeNewFile = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExisting = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    if (primaryIdx >= existingImages.length - 1) setPrimaryIdx(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Upload new files to Supabase Storage
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${agentId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("property-images").upload(path, file, { upsert: false });
      if (data && !error) {
        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    // Merge: existing first, then new, then reorder so primary is first
    const allImages = [...existingImages, ...uploadedUrls];
    const reordered = allImages.length > 0
      ? [allImages[primaryIdx], ...allImages.filter((_, i) => i !== primaryIdx)]
      : [];

    setUploading(false);
    onSave({
      ...(property?.id ? { id: property.id } : {}),
      title: form.title,
      country: form.country,
      city: form.city,
      neighborhood: form.neighborhood || undefined,
      price: form.price,
      currency: form.currency,
      show_roi: form.show_roi,
      expected_roi: form.show_roi ? form.expected_roi : 0,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      area_sqm: form.area_sqm || undefined,
      floor: form.floor !== "" ? Number(form.floor) : null,
      year_built: form.year_built !== "" ? Number(form.year_built) : null,
      property_type: form.property_type,
      description: form.description,
      images: reordered,
      amenities: form.amenities,
      furnished: form.furnished,
      agent_name: "",
      agent_email: "",
    });
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none";
  const selectCls = inputCls + " bg-white";
  const allImagesPreview = [...existingImages, ...imageFiles.map((f) => URL.createObjectURL(f))];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
      <h3 className="text-lg font-bold text-gray-900">
        {property ? t("dashboard.agent.editProperty") : t("dashboard.agent.addProperty")}
      </h3>

      {/* Section: Basic Info */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{lang === "he" ? "פרטים בסיסיים" : "Basic Details"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.propTitle")}</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.country")}</label>
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={selectCls}>
              <option value="Greece">Greece</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Georgia">Georgia</option>
              <option value="Portugal">Portugal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.city")}</label>
            <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{lang === "he" ? "שכונה" : "Neighborhood"}</label>
            <input type="text" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.propType")}</label>
            <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className={selectCls}>
              {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Section: Financial */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{lang === "he" ? "מחיר ותשואה" : "Price & Returns"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.price")}</label>
            <div className="flex gap-2">
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as typeof CURRENCIES[number] })} className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 cursor-pointer">
              <input type="checkbox" checked={form.show_roi} onChange={(e) => setForm({ ...form, show_roi: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
              {lang === "he" ? "הוסף תשואה צפויה (%)" : "Add Expected ROI (%)"}
            </label>
            {form.show_roi && (
              <input type="number" min={0} step={0.1} value={form.expected_roi} onChange={(e) => setForm({ ...form, expected_roi: parseFloat(e.target.value) || 0 })} className={inputCls} />
            )}
          </div>
        </div>
      </div>

      {/* Section: Property specs */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{lang === "he" ? "מפרט הנכס" : "Property Specs"}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.bedrooms")}</label>
            <input type="number" required min={0} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 0 })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{lang === "he" ? "חדרי שירות" : "Bathrooms"}</label>
            <input type="number" required min={0} value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: parseInt(e.target.value) || 0 })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{lang === "he" ? "שטח (מ״ר)" : "Area (sqm)"}</label>
            <input type="number" min={0} value={form.area_sqm} onChange={(e) => setForm({ ...form, area_sqm: parseInt(e.target.value) || 0 })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{lang === "he" ? "קומה" : "Floor"}</label>
            <input type="number" min={0} value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} className={inputCls} placeholder="—" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{lang === "he" ? "שנת בנייה" : "Year Built"}</label>
            <input type="number" min={1900} max={2030} value={form.year_built} onChange={(e) => setForm({ ...form, year_built: e.target.value })} className={inputCls} placeholder="2020" />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.furnished} onChange={(e) => setForm({ ...form, furnished: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm font-medium text-gray-700">{lang === "he" ? "מרוהט" : "Furnished"}</span>
          </label>
        </div>
      </div>

      {/* Section: Amenities */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{lang === "he" ? "מתקנים ואביזרים" : "Amenities"}</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((a) => (
            <button key={a} type="button" onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.amenities.includes(a) ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
              }`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.description")}</label>
        <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " resize-none"} />
      </div>

      {/* Section: Images Upload */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{lang === "he" ? "תמונות הנכס" : "Property Images"}</p>
        <p className="text-xs text-gray-400 mb-3">{lang === "he" ? "לחץ על תמונה כדי להגדיר אותה כראשית (כוכב = ראשית)" : "Click an image to set it as primary (★ = primary)"}</p>

        {/* Image previews */}
        {allImagesPreview.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {allImagesPreview.map((src, idx) => (
              <div key={idx} className="relative group">
                <img src={src} alt="" className={`w-24 h-24 object-cover rounded-xl border-2 cursor-pointer transition-all ${primaryIdx === idx ? "border-primary-500 ring-2 ring-primary-300" : "border-gray-200 hover:border-primary-300"}`}
                  onClick={() => setPrimaryIdx(idx)} />
                {primaryIdx === idx && (
                  <span className="absolute top-1 left-1 text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">★</span>
                )}
                <button type="button"
                  onClick={() => idx < existingImages.length ? removeExisting(idx) : removeNewFile(idx - existingImages.length)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs items-center justify-center hidden group-hover:flex">×</button>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-50 border border-dashed border-gray-300 hover:border-primary-400 rounded-xl px-4 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {lang === "he" ? "הוסף תמונה" : "Add Image"}
          <input type="file" accept="image/*" multiple onChange={handleFileAdd} className="hidden" />
        </label>
        <p className="text-xs text-gray-400 mt-1">{lang === "he" ? "JPG, PNG, WEBP — ניתן לבחור מספר קבצים" : "JPG, PNG, WEBP — multiple files allowed"}</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={uploading} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
          {uploading ? (lang === "he" ? "מעלה תמונות..." : "Uploading...") : property ? t("dashboard.agent.updateProperty") : t("dashboard.agent.addProperty")}
        </button>
        <button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
          {t("admin.cancel")}
        </button>
      </div>
    </form>
  );
}

/* ─────── Pending Approval Screen ─────── */
function PendingApprovalScreen({
  userId, refreshProfile, lang,
}: { userId: string; refreshProfile: () => Promise<void>; lang: string }) {
  useEffect(() => {
    const channel = supabase
      .channel(`profile-approved-${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        async (payload) => {
          if (payload.new?.approved === true) {
            await refreshProfile();
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, refreshProfile]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-10">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-amber-800 mb-3">
          {lang === "he" ? "הבקשה שלכם בבדיקה" : "Your Application is Under Review"}
        </h1>
        <p className="text-amber-700 leading-relaxed mb-6">
          {lang === "he"
            ? "תודה על ההרשמה! צוות MANAIO בודק את רישיון התיווך שלכם ואת הסכם השותפות. תקבלו הודעה במייל לאחר אישור החשבון (בדרך כלל תוך 1-2 ימי עסקים)."
            : "Thank you for registering! The MANAIO team is reviewing your broker license and partnership agreement. You will receive an email once your account is approved (usually within 1-2 business days)."}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-amber-500 mb-6">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          {lang === "he" ? "ממתין לאישור — הדף יתעדכן אוטומטית" : "Waiting for approval — page will update automatically"}
        </div>
        <div className="text-sm text-amber-600 bg-amber-100 rounded-xl px-4 py-3 inline-block">
          {lang === "he" ? "שאלות? " : "Questions? "}
          <a href="mailto:agents@mymanaio.com" className="font-semibold underline">agents@mymanaio.com</a>
        </div>
      </div>
    </div>
  );
}

/* ─────── Main Agent Dashboard ─────── */
export default function AgentDashboard() {
  const { user, profile, loading, isAgent, updateProfile, refreshProfile } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ConversationWithDetails | null>(null);

  // Profile form
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setAgentName(profile.full_name || "");
      setAgentPhone(profile.phone || "");
      setCompany(profile.company || "");
      setCompanyUrl(profile.company_url || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch agent's properties
      const { data: propsData } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });
      if (propsData) setProperties(propsData);
      setPropsLoading(false);

      // Fetch leads for agent's properties
      const { data: leadsData } = await supabase
        .from("leads")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });
      if (leadsData) setLeads(leadsData);
      setLeadsLoading(false);

      // Fetch conversations with buyer info
      const { data: convos } = await supabase
        .from("conversations")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (convos && convos.length > 0) {
        const buyerIds = [...new Set(convos.map((c: Conversation) => c.buyer_id))];
        const propertyIds = [...new Set(convos.map((c: Conversation) => c.property_id))];

        const { data: buyerProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", buyerIds);

        const { data: convProps } = await supabase
          .from("properties")
          .select("id, title")
          .in("id", propertyIds);

        const enriched: ConversationWithDetails[] = [];
        for (const conv of convos) {
          const buyer = buyerProfiles?.find((p: { id: string }) => p.id === conv.buyer_id);
          const prop = convProps?.find((p: { id: string }) => p.id === conv.property_id);

          // Get last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count } = await supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .neq("sender_id", user.id)
            .eq("read", false);

          enriched.push({
            ...conv,
            buyer_name: buyer?.full_name || buyer?.email || "Unknown",
            buyer_email: buyer?.email || "",
            property_title: prop?.title || "",
            last_message: lastMsg?.content,
            last_message_at: lastMsg?.created_at,
            unread_count: count || 0,
          });
        }
        // Sort by last message time
        enriched.sort((a, b) => {
          const aTime = a.last_message_at || a.created_at;
          const bTime = b.last_message_at || b.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
        setConversations(enriched);
      }
      setChatsLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">{t("properties.loading")}</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("dashboard.agent.title")}</h1>
          <p className="text-gray-500 mb-6 text-center">{t("dashboard.agent.signInRequired")}</p>
          <LoginForm />
        </div>
      </div>
    );
  }

  if (!isAgent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("dashboard.agent.accessDenied")}</h1>
        <p className="text-gray-500">{t("dashboard.agent.agentsOnly")}</p>
      </div>
    );
  }

  // Agent is registered but not yet approved by admin — with realtime approval detection
  if (profile?.approved === false || profile?.approved === null) {
    return <PendingApprovalScreen userId={user!.id} refreshProfile={refreshProfile} lang={lang} />;
  }

  // Stats
  const activeProps = properties.filter(p => (p.status || "active") === "active");
  const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const totalClicks = properties.reduce((sum, p) => sum + (p.clicks_count || 0), 0);
  const conversionRate = totalClicks > 0 ? ((leads.length / totalClicks) * 100).toFixed(1) : "0";

  const handleSaveProperty = async (data: Omit<Property, "id"> & { id?: string }) => {
    if (data.id) {
      // Update
      await supabase
        .from("properties")
        .update({
          title: data.title, country: data.country, city: data.city,
          neighborhood: data.neighborhood,
          price: data.price, currency: data.currency, show_roi: data.show_roi,
          expected_roi: data.expected_roi,
          bedrooms: data.bedrooms, bathrooms: data.bathrooms,
          area_sqm: data.area_sqm, floor: data.floor, year_built: data.year_built,
          property_type: data.property_type, description: data.description,
          images: data.images, amenities: data.amenities,
          furnished: data.furnished,
        })
        .eq("id", data.id);
      setProperties(prev => prev.map(p => p.id === data.id ? { ...p, ...data } as Property : p));
    } else {
      // Insert
      const { data: newProp } = await supabase
        .from("properties")
        .insert({
          title: data.title, country: data.country, city: data.city,
          neighborhood: data.neighborhood,
          price: data.price, currency: data.currency, show_roi: data.show_roi,
          expected_roi: data.expected_roi,
          bedrooms: data.bedrooms, bathrooms: data.bathrooms,
          area_sqm: data.area_sqm, floor: data.floor, year_built: data.year_built,
          property_type: data.property_type, description: data.description,
          images: data.images, amenities: data.amenities,
          furnished: data.furnished,
          agent_id: user.id,
          agent_name: profile?.full_name || user.email || "",
          agent_email: user.email || "",
          status: "active",
        })
        .select()
        .single();
      if (newProp) {
        setProperties(prev => [newProp, ...prev]);
        // Notify followers
        const { data: followers } = await supabase
          .from("favorite_agents")
          .select("buyer_id")
          .eq("agent_id", user.id);
        if (followers && followers.length > 0) {
          const notifications = followers.map((f: { buyer_id: string }) => ({
            user_id: f.buyer_id,
            type: "new_property" as const,
            title: lang === "he" ? "מודעה חדשה ממתווך מועדף" : "New listing from a favorite agent",
            body: `${profile?.full_name || user.email}: ${data.title}`,
            link: `/properties/${newProp.id}`,
          }));
          await supabase.from("notifications").insert(notifications);
        }
      }
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    await supabase.from("properties").delete().eq("id", id);
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleStatus = async (p: Property) => {
    const newStatus = (p.status || "active") === "active" ? "closed" : "active";
    await supabase.from("properties").update({ status: newStatus }).eq("id", p.id);
    setProperties(prev => prev.map(prop => prop.id === p.id ? { ...prop, status: newStatus } as Property : prop));
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    await supabase.from("leads").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", leadId);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Budget", "Property", "Status", "Date"];
    const rows = leads.map(l => [
      l.name, l.email, l.phone, l.investment_budget,
      properties.find(p => p.id === l.property_id)?.title || l.property_id,
      l.status || "sent",
      l.created_at ? new Date(l.created_at).toLocaleDateString() : "",
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    await updateProfile({
      full_name: agentName,
      phone: agentPhone,
      company,
      company_url: companyUrl,
    });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { key: "properties" as Tab, label: t("dashboard.agent.myProperties"), icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { key: "leads" as Tab, label: t("dashboard.agent.leads"), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "chats" as Tab, label: t("dashboard.agent.chats"), icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: conversations.reduce((sum, c) => sum + c.unread_count, 0) },
    { key: "stats" as Tab, label: t("dashboard.agent.statistics"), icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { key: "profile" as Tab, label: t("dashboard.agent.myProfile"), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{t("dashboard.agent.title")}</h1>
          <p className="text-primary-200">{t("dashboard.agent.welcome")}, {profile?.full_name || user.email}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{activeProps.length}</p>
              <p className="text-xs text-primary-200">{t("dashboard.agent.activeProperties")}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{leads.length}</p>
              <p className="text-xs text-primary-200">{t("dashboard.agent.totalLeads")}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-xs text-primary-200">{t("dashboard.agent.totalViews")}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{conversionRate}%</p>
              <p className="text-xs text-primary-200">{t("dashboard.agent.conversion")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
              {"badge" in tab && typeof tab.badge === "number" && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div>
            {(showForm || editing) ? (
              <div className="mb-6">
                <AgentPropertyForm
                  property={editing || undefined}
                  onSave={handleSaveProperty}
                  onCancel={() => { setEditing(null); setShowForm(false); }}
                  agentId={user.id}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("dashboard.agent.addProperty")}
              </button>
            )}

            {propsLoading ? (
              <div className="text-center py-16 text-gray-400">{t("properties.loading")}</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg mb-2">{t("dashboard.agent.noProperties")}</p>
                <p className="text-sm">{t("dashboard.agent.noPropertiesSub")}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.propTitle")}</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.location")}</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.price")}</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">ROI</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.status")}</th>
                        <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {p.images[0] && <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                              <div>
                                <span className="font-medium text-gray-900 line-clamp-1">{p.title}</span>
                                {p.featured && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold ml-2">Featured</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{p.city}, {p.country}</td>
                          <td className="px-6 py-4 font-medium">€{p.price.toLocaleString()}</td>
                          <td className="px-6 py-4"><span className="text-accent-600 font-semibold">{p.expected_roi}%</span></td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${(p.status || "active") === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {(p.status || "active") === "active" ? (lang === "he" ? "פעיל" : "Active") : (lang === "he" ? "סגור" : "Closed")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditing(p); setShowForm(false); }} className="text-primary-600 hover:text-primary-700 font-medium">{t("admin.edit")}</button>
                              <button onClick={() => handleToggleStatus(p)} className={`font-medium ${(p.status || "active") === "active" ? "text-amber-600" : "text-green-600"}`}>
                                {(p.status || "active") === "active" ? (lang === "he" ? "סגור" : "Close") : (lang === "he" ? "פתח" : "Reopen")}
                              </button>
                              <button onClick={() => handleDeleteProperty(p.id)} className="text-red-500 hover:text-red-600 font-medium">{t("admin.delete")}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div>
            {leads.length > 0 && (
              <div className="flex justify-end mb-4">
                <button onClick={handleExportCSV} className="text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("dashboard.agent.exportCSV")}
                </button>
              </div>
            )}
            {leadsLoading ? (
              <div className="text-center py-16 text-gray-400">{t("properties.loading")}</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg mb-2">{t("dashboard.agent.noLeads")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[lead.status || "sent"]}`}>
                            {statusLabels[lang][lead.status || "sent"]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {t("dashboard.agent.property")}: {properties.find(p => p.id === lead.property_id)?.title || lead.property_id}
                        </p>
                        <p className="text-sm text-gray-500">{lead.message || "—"}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">{lead.email}</a>
                          <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          <span>{lead.investment_budget}</span>
                          <span>{lead.created_at ? new Date(lead.created_at).toLocaleDateString(lang === "he" ? "he-IL" : "en-US") : ""}</span>
                        </div>
                      </div>
                      <div>
                        <select
                          value={lead.status || "sent"}
                          onChange={(e) => handleUpdateLeadStatus(lead.id!, e.target.value as LeadStatus)}
                          className="text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value="sent">{statusLabels[lang].sent}</option>
                          <option value="in_progress">{statusLabels[lang].in_progress}</option>
                          <option value="answered">{statusLabels[lang].answered}</option>
                          <option value="closed">{statusLabels[lang].closed}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chats Tab */}
        {activeTab === "chats" && (
          <div>
            {activeChat ? (
              <div>
                <button
                  onClick={() => setActiveChat(null)}
                  className="mb-4 text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("chat.backToChats")}
                </button>
                <div className="text-sm text-gray-500 mb-3">
                  {t("dashboard.agent.property")}: <span className="font-medium text-gray-700">{activeChat.property_title}</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-[500px]">
                  <ChatWindow
                    conversationId={activeChat.id}
                    otherName={activeChat.buyer_name}
                  />
                </div>
              </div>
            ) : chatsLoading ? (
              <div className="text-center py-16 text-gray-400">{t("properties.loading")}</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg mb-2">{t("chat.noChats")}</p>
                <p className="text-sm">{t("chat.noChatsSub")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className="w-full bg-white rounded-2xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all text-start"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {conv.buyer_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm">{conv.buyer_name}</h3>
                            {conv.unread_count > 0 && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{conv.unread_count}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{conv.property_title}</p>
                          {conv.last_message && (
                            <p className="text-sm text-gray-600 truncate mt-1">{conv.last_message}</p>
                          )}
                        </div>
                      </div>
                      {conv.last_message_at && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(conv.last_message_at).toLocaleDateString(lang === "he" ? "he-IL" : "en-US")}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">{t("dashboard.agent.totalViews")}</p>
                <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">{t("dashboard.agent.totalClicks")}</p>
                <p className="text-3xl font-bold text-purple-600">{totalClicks}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">{t("dashboard.agent.totalLeads")}</p>
                <p className="text-3xl font-bold text-green-600">{leads.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">{t("dashboard.agent.conversion")}</p>
                <p className="text-3xl font-bold text-amber-600">{conversionRate}%</p>
              </div>
            </div>

            {/* Per-property stats */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("dashboard.agent.propertyStats")}</h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.propTitle")}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.views")}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.clicks")}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("dashboard.agent.leadsCount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => {
                      const propLeads = leads.filter(l => l.property_id === p.id).length;
                      return (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                          <td className="px-6 py-4 text-gray-600">{p.views_count || 0}</td>
                          <td className="px-6 py-4 text-gray-600">{p.clicks_count || 0}</td>
                          <td className="px-6 py-4">
                            <span className="bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">{propLeads}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-xl">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="text-lg font-bold text-gray-900">{t("dashboard.agent.profileDetails")}</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
                <input type="email" disabled value={user.email || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.name")}</label>
                <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.phone")}</label>
                <input type="tel" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.companyName")}</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.companyUrl")}</label>
                <input type="url" value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://" />
              </div>

              {saveSuccess && <p className="text-accent-600 text-sm font-medium">{t("dashboard.buyer.saved")}</p>}
              <button type="submit" disabled={saving} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
                {saving ? t("auth.pleaseWait") : t("dashboard.buyer.saveChanges")}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
