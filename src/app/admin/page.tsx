"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import LoginForm from "@/components/LoginForm";
import { useProperties } from "@/lib/PropertiesContext";
import { Property, Lead, Payment, PaymentStatus, PaymentType } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

type Tab = "properties" | "closed" | "leads" | "agents" | "users" | "pending_agents" | "finance";

const ADMIN_PROPERTY_TYPES = ["Apartment", "Land", "Detached House", "Villa", "Maisonette", "Apartment Complex"];
const CURRENCIES = ["EUR", "USD", "GBP", "ILS"] as const;

/* ─────────────── Property Form ─────────────── */
function PropertyForm({
  property,
  onSave,
  onCancel,
}: {
  property?: Property;
  onSave: (data: Property) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Property & { show_roi: boolean }>(
    {
      id: property?.id || Date.now().toString(),
      title: property?.title || "",
      country: property?.country || "Greece",
      city: property?.city || "",
      price: property?.price || 0,
      currency: property?.currency || "EUR",
      show_roi: property?.show_roi ?? true,
      expected_roi: property?.expected_roi || 0,
      bedrooms: property?.bedrooms || 1,
      property_type: property?.property_type || "Apartment",
      description: property?.description || "",
      images: property?.images || [],
      agent_name: property?.agent_name || "",
      agent_email: property?.agent_email || "",
      status: property?.status || "active",
      featured: property?.featured || false,
    }
  );

  // Image upload
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const allPreviews = [
    ...form.images,
    ...imageFiles.map((f) => URL.createObjectURL(f)),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(imageFiles.length > 0);
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("property-images").upload(path, file, { upsert: false });
      if (data && !error) {
        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }
    }
    const allImages = [...form.images, ...uploadedUrls];
    const reordered = allImages.length > 0
      ? [allImages[primaryIdx], ...allImages.filter((_, i) => i !== primaryIdx)]
      : [];
    setUploading(false);
    onSave({ ...form, images: reordered, expected_roi: form.show_roi ? form.expected_roi : 0 });
  };

  const { t } = useLanguage();
  const inp = "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">{property ? t("admin.form.editProperty") : t("admin.form.addNewProperty")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.form.titleLabel")}</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("detail.country")}</label>
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inp + " bg-white"}>
            <option value="Greece">{t("footer.greece")}</option><option value="Cyprus">{t("footer.cyprus")}</option>
            <option value="Georgia">{t("footer.georgia")}</option><option value="Portugal">{t("footer.portugal")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.form.city")}</label>
          <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("card.price")}</label>
          <div className="flex gap-2">
            <select value={form.currency || "EUR"} onChange={(e) => setForm({ ...form, currency: e.target.value as "EUR" | "USD" | "GBP" | "ILS" })} className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className={inp} />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 cursor-pointer">
            <input type="checkbox" checked={form.show_roi} onChange={(e) => setForm({ ...form, show_roi: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
            {t("admin.form.expectedRoi")}
          </label>
          {form.show_roi && (
            <input type="number" min={0} step={0.1} value={form.expected_roi} onChange={(e) => setForm({ ...form, expected_roi: parseFloat(e.target.value) || 0 })} className={inp} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.form.bedrooms")}</label>
          <input type="number" required min={0} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 1 })} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("detail.propertyType")}</label>
          <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className={inp + " bg-white"}>
            {ADMIN_PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{t(`propertyType.${pt.toLowerCase().replace(/ /g, "")}`) || pt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.form.agentName")}</label>
          <input type="text" required value={form.agent_name} onChange={(e) => setForm({ ...form, agent_name: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.form.agentEmail")}</label>
          <input type="email" required value={form.agent_email} onChange={(e) => setForm({ ...form, agent_email: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.form.status")}</label>
          <select value={form.status || "active"} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "closed" })} className={inp + " bg-white"}>
            <option value="active">{t("admin.form.statusActive")}</option><option value="closed">{t("admin.form.statusClosed")}</option>
          </select>
        </div>
        {/* PREMIUM — admin only */}
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="premium" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-amber-500 rounded" />
          <label htmlFor="premium" className="text-sm font-semibold text-amber-600 cursor-pointer">{t("admin.form.premium")}</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("dashboard.agent.description")}</label>
        <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp + " resize-none"} />
      </div>
      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("admin.form.images")} <span className="text-gray-400 font-normal text-xs">{t("admin.form.clickToSetPrimary")}</span></label>
        {allPreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {allPreviews.map((src, idx) => (
              <div key={idx} className="relative group">
                <img src={src} alt="" onClick={() => setPrimaryIdx(idx)}
                  className={`w-20 h-20 object-cover rounded-xl border-2 cursor-pointer ${primaryIdx === idx ? "border-amber-500 ring-2 ring-amber-300" : "border-gray-200"}`} />
                {primaryIdx === idx && <span className="absolute top-1 left-1 text-xs bg-amber-500 text-white px-1 rounded-full">★</span>}
              </div>
            ))}
          </div>
        )}
        <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-50 border border-dashed border-gray-300 hover:border-primary-400 rounded-xl px-4 py-3 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {t("admin.form.addImage")}
          <input type="file" accept="image/*" multiple onChange={handleFileAdd} className="hidden" />
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={uploading} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
          {uploading ? t("admin.form.uploading") : property ? t("admin.updateProperty") : t("admin.addProperty")}
        </button>
        <button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">{t("admin.cancel")}</button>
      </div>
    </form>
  );
}

/* ─────────────── Stat Card ─────────────── */
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

/* ─────────────── Properties Tab ─────────────── */
function PropertiesTab({ status }: { status: "active" | "closed" }) {
  const { properties, updateProperty, deleteProperty, addProperty } = useProperties();
  const { t } = useLanguage();
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = properties.filter((p) => (p.status || "active") === status);

  const handleSave = async (property: Property) => {
    if (editing) {
      await updateProperty(property);
    } else {
      await addProperty({ ...property, status });
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleToggleStatus = async (p: Property) => {
    const newStatus = (p.status || "active") === "active" ? "closed" : "active";
    await updateProperty({ ...p, status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("admin.deleteConfirm"))) {
      await deleteProperty(id);
    }
  };

  return (
    <div>
      {status === "active" && (
        (showForm || editing) ? (
          <div className="mb-6">
            <PropertyForm
              property={editing || undefined}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setShowForm(false); }}
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
            {t("admin.addNew")}
          </button>
        )
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {status === "active" ? t("admin.noActiveProperties") : t("admin.noClosedProperties")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.table.property")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.table.location")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("card.price")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.table.roi")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.table.type")}</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("admin.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900 line-clamp-1">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.city}, {p.country}</td>
                    <td className="px-6 py-4 font-medium">€{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4"><span className="text-accent-600 font-semibold">{p.expected_roi}%</span></td>
                    <td className="px-6 py-4 text-gray-600">{p.property_type}</td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing(p); setShowForm(false); }} className="text-primary-600 hover:text-primary-700 font-medium">{t("admin.table.edit")}</button>
                        <button onClick={() => handleToggleStatus(p)} className={`font-medium ${status === "active" ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"}`}>
                          {status === "active" ? t("admin.closeProperty") : t("admin.reopenProperty")}
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 font-medium">{t("admin.delete")}</button>
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
  );
}

/* ─────────────── Leads Tab ─────────────── */
function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { properties } = useProperties();
  const { t, lang } = useLanguage();

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setLeads(data);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const getPropertyTitle = (id: string | null) => {
    if (!id) return t("admin.generalInquiry");
    const prop = properties.find((p) => p.id === id);
    return prop?.title || `#${id}`;
  };

  if (loading) return <div className="text-center py-16 text-gray-400">{t("admin.loadingLeads")}</div>;

  return leads.length === 0 ? (
    <div className="text-center py-16 text-gray-400">{t("admin.noLeads")}</div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.name")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.email")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.phone")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.budget")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.property")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.message")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.date")}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4">
                  <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">{lead.email}</a>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.investment_budget}</td>
                <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{getPropertyTitle(lead.property_id)}</td>
                <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{lead.message || "—"}</td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────── Agents Tab ─────────────── */
function AgentsTab() {
  const { properties } = useProperties();
  const { t } = useLanguage();

  const agents = useMemo(() => {
    const map = new Map<string, { name: string; email: string; country: string; city: string; propertyCount: number }>();
    properties.forEach((p) => {
      const key = p.agent_email;
      const existing = map.get(key);
      if (existing) {
        existing.propertyCount++;
      } else {
        map.set(key, { name: p.agent_name, email: p.agent_email, country: p.country, city: p.city, propertyCount: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.country.localeCompare(b.country));
  }, [properties]);

  return agents.length === 0 ? (
    <div className="text-center py-16 text-gray-400">{t("admin.noAgents")}</div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.agents.agent")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.email")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.agents.country")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.agents.city")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.agents.properties")}</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.email} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {agent.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{agent.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href={`mailto:${agent.email}`} className="text-primary-600 hover:underline">{agent.email}</a>
                </td>
                <td className="px-6 py-4 text-gray-600">{agent.country}</td>
                <td className="px-6 py-4 text-gray-600">{agent.city}</td>
                <td className="px-6 py-4">
                  <span className="bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">{agent.propertyCount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────── Pending Agents Tab ─────────────── */
type PendingAgent = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  company: string;
  license_url: string | null;
  id_url: string | null;
  partnership_signed: boolean | null;
  created_at: string;
  approved?: boolean | null;
};

function DocStatus({ url, label, icon, missingLabel }: { url: string | null; label: string; icon: React.ReactNode; missingLabel: string }) {
  const handleView = async () => {
    if (!url) return;
    // Generate a short-lived signed URL (60 seconds) for private bucket access
    const { data } = await supabase.storage
      .from("agent-licenses")
      .createSignedUrl(url, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (url) {
    return (
      <button
        onClick={handleView}
        className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-2 text-sm font-medium hover:bg-green-100 transition-colors w-full text-start"
      >
        <span className="w-5 h-5 text-green-500 shrink-0">{icon}</span>
        <span>{label}</span>
        <svg className="w-3.5 h-3.5 text-green-400 ms-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-sm font-medium">
      <span className="w-5 h-5 text-red-400 shrink-0">{icon}</span>
      <span>{label}</span>
      <span className="ms-auto text-xs text-red-400">{missingLabel}</span>
    </div>
  );
}

function PendingAgentsTab() {
  const [agents, setAgents] = useState<PendingAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  const fetchAgents = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, company, license_url, id_url, partnership_signed, created_at")
      .eq("role", "agent")
      .or("approved.is.null,approved.eq.false")
      .order("created_at", { ascending: false });
    if (data) setAgents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();

    // Realtime: new agent registrations appear instantly
    const channel = supabase
      .channel("pending-agents-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles", filter: "role=eq.agent" },
        (payload) => {
          const newAgent = payload.new as PendingAgent;
          if (!newAgent.approved) {
            setAgents((prev) => {
              if (prev.find((a) => a.id === newAgent.id)) return prev;
              return [newAgent, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await supabase.from("profiles").update({ approved: true }).eq("id", id);
    const agent = agents.find(a => a.id === id);
    if (agent) {
      fetch("/api/notify-agent-approved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: agent.email, name: agent.full_name || agent.email, approved: true }),
      }).catch(() => null);
    }
    setAgents(prev => prev.filter(a => a.id !== id));
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm(t("admin.rejectConfirm"))) return;
    setActionLoading(id);
    const agent = agents.find(a => a.id === id);
    await supabase.from("profiles").update({ approved: false, role: "buyer" }).eq("id", id);
    if (agent) {
      fetch("/api/notify-agent-approved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: agent.email, name: agent.full_name || agent.email, approved: false }),
      }).catch(() => null);
    }
    setAgents(prev => prev.filter(a => a.id !== id));
    setActionLoading(null);
  };

  if (loading) return <div className="text-center py-16 text-gray-400">{t("admin.loading")}</div>;

  return agents.length === 0 ? (
    <div className="text-center py-16 text-gray-400">
      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{t("admin.pendingAgents.noPending")}</p>
    </div>
  ) : (
    <div className="space-y-5">
      {agents.map((agent) => {
        const allDocsOk = !!agent.license_url && !!agent.id_url && !!agent.partnership_signed;
        return (
          <div key={agent.id} className={`bg-white rounded-2xl border p-6 shadow-sm ${allDocsOk ? "border-amber-200" : "border-red-200"}`}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{t("admin.pendingApproval")}</span>
                  {!allDocsOk && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">{t("admin.missingDocuments")}</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{agent.full_name || "—"}</h3>
                <a href={`mailto:${agent.email}`} className="text-sm text-primary-600 hover:underline">{agent.email}</a>
                {agent.phone && <p className="text-sm text-gray-500 mt-0.5">{agent.phone}</p>}
                {agent.company && <p className="text-sm text-gray-500">{agent.company}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {t("admin.registered")} {new Date(agent.created_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US")}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(agent.id)}
                  disabled={actionLoading === agent.id}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("admin.approve")}
                </button>
                <button
                  onClick={() => handleReject(agent.id)}
                  disabled={actionLoading === agent.id}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t("admin.reject")}
                </button>
              </div>
            </div>

            {/* Documents & contract status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DocStatus
                url={agent.license_url}
                label={t("admin.brokerLicense")}
                missingLabel={t("admin.missing")}
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <DocStatus
                url={agent.id_url}
                label={t("admin.idCard")}
                missingLabel={t("admin.missing")}
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                  </svg>
                }
              />
              {/* Partnership agreement status (no URL, just signed/not) */}
              {agent.partnership_signed ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-2 text-sm font-medium">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t("admin.partnershipAgreement")}</span>
                  <span className="ms-auto text-xs text-green-500">{t("admin.partnershipApproved")}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-sm font-medium">
                  <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t("admin.partnershipAgreement")}</span>
                  <span className="ms-auto text-xs text-red-400">{t("admin.notSigned")}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────── Users Tab ─────────────── */
function UsersTab() {
  const [users, setUsers] = useState<{ id: string; email: string; role: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-400">{t("admin.loadingUsers")}</div>;

  return users.length === 0 ? (
    <div className="text-center py-16 text-gray-400">
      <p>{t("admin.noUsers")}</p>
    </div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.leads.email")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.users.role")}</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.users.joined")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{u.email}</td>
                <td className="px-6 py-4 text-gray-600">{u.role}</td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(u.created_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────── Finance Tab ─────────────── */
type AgentSummary = {
  agent_id: string;
  agent_name: string;
  agent_email: string;
  lead_count: number;
  total_owed: number;
  total_paid: number;
};

type FinanceLead = { id: string; name: string; agent_id: string | null; property_id: string; created_at: string };

function FinanceTab() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [agents, setAgents] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [leads, setLeads] = useState<FinanceLead[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New payment form state
  const [formAgent, setFormAgent] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<PaymentType>("lead_fee");
  const [formNotes, setFormNotes] = useState("");
  const [formLead, setFormLead] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: paymentsData }, { data: agentsData }, { data: leadsData }] = await Promise.all([
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email").eq("role", "agent").eq("approved", true),
        supabase.from("leads").select("id, name, agent_id, property_id, created_at").order("created_at", { ascending: false }),
      ]);
      if (paymentsData) setPayments(paymentsData);
      if (agentsData) setAgents(agentsData);
      if (leadsData) setLeads(leadsData);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const agentSummaries: AgentSummary[] = useMemo(() => {
    return agents.map((agent) => {
      const agentPayments = payments.filter((p) => p.agent_id === agent.id);
      const agentLeads = leads.filter((l) => l.agent_id === agent.id);
      const totalOwed = agentPayments.reduce((s, p) => s + (p.amount || 0), 0);
      const totalPaid = agentPayments.filter((p) => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);
      return {
        agent_id: agent.id,
        agent_name: agent.full_name || agent.email,
        agent_email: agent.email,
        lead_count: agentLeads.length,
        total_owed: totalOwed,
        total_paid: totalPaid,
      };
    });
  }, [agents, payments, leads]);

  const totalOwed = agentSummaries.reduce((s, a) => s + a.total_owed, 0);
  const totalPaid = agentSummaries.reduce((s, a) => s + a.total_paid, 0);
  const totalPending = totalOwed - totalPaid;

  const handleMarkPaid = async (paymentId: string) => {
    setActionLoading(paymentId);
    await supabase.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", paymentId);
    setPayments((prev) => prev.map((p) => p.id === paymentId ? { ...p, status: "paid" as PaymentStatus, paid_at: new Date().toISOString() } : p));
    setActionLoading(null);
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm(t("admin.finance.deleteConfirm"))) return;
    setActionLoading(paymentId);
    await supabase.from("payments").delete().eq("id", paymentId);
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    setActionLoading(null);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAgent || !formAmount) return;
    setFormSaving(true);
    const { data } = await supabase.from("payments").insert({
      agent_id: formAgent,
      amount: parseFloat(formAmount) || 0,
      type: formType,
      status: "pending",
      notes: formNotes || null,
      lead_id: formLead || null,
    }).select().single();
    if (data) setPayments((prev) => [data, ...prev]);
    setFormAgent(""); setFormAmount(""); setFormType("lead_fee"); setFormNotes(""); setFormLead("");
    setShowForm(false);
    setFormSaving(false);
  };

  const handleExportCSV = () => {
    const headers = [t("admin.finance.agent"), t("admin.leads.email"), t("admin.finance.type"), t("admin.finance.amountLabel"), t("admin.finance.status"), t("admin.finance.notesCol"), t("admin.finance.dateCol")];
    const rows = payments.map((p) => {
      const agent = agents.find((a) => a.id === p.agent_id);
      return [
        agent?.full_name || "", agent?.email || "",
        p.type, p.amount, p.status, p.notes || "",
        p.created_at ? new Date(p.created_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US") : "",
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-16 text-gray-400">{t("admin.loadingFinance")}</div>;

  const typeLabels: Record<PaymentType, string> = { lead_fee: t("admin.finance.leadFee"), commission: t("admin.finance.commission"), bonus: t("admin.finance.bonus") };
  const typeColors: Record<PaymentType, string> = { lead_fee: "bg-blue-100 text-blue-700", commission: "bg-purple-100 text-purple-700", bonus: "bg-amber-100 text-amber-700" };

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">{t("admin.finance.totalCharged")}</p>
          <p className="text-3xl font-bold text-blue-600">₪{totalOwed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">{t("admin.finance.paid")}</p>
          <p className="text-3xl font-bold text-green-600">₪{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">{t("admin.finance.pendingPayment")}</p>
          <p className="text-3xl font-bold text-amber-600">₪{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Per-agent summary */}
      {agentSummaries.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("admin.finance.agentSummary")}</h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.agent")}</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.leads")}</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.totalOwed")}</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.paid")}</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.balance")}</th>
                  </tr>
                </thead>
                <tbody>
                  {agentSummaries.map((a) => (
                    <tr key={a.agent_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {a.agent_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{a.agent_name}</p>
                            <p className="text-xs text-gray-400">{a.agent_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">{a.lead_count}</span></td>
                      <td className="px-6 py-4 font-medium">₪{a.total_owed.toLocaleString()}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">₪{a.total_paid.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${(a.total_owed - a.total_paid) > 0 ? "text-amber-600" : "text-gray-400"}`}>
                          ₪{(a.total_owed - a.total_paid).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment actions */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-bold text-gray-900">{t("admin.finance.paymentDetails")}</h3>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="text-sm font-medium text-primary-600 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t("admin.finance.exportCSV")}
          </button>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("admin.finance.addPayment")}
          </button>
        </div>
      </div>

      {/* Add payment form */}
      {showForm && (
        <form onSubmit={handleAddPayment} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 space-y-4">
          <h4 className="font-bold text-gray-900">{t("admin.finance.addPaymentTitle")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.finance.agent")}</label>
              <select required value={formAgent} onChange={(e) => setFormAgent(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">{t("admin.finance.selectAgent")}</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name || a.email}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.finance.type")}</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value as PaymentType)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="lead_fee">{t("admin.finance.leadFee")}</option>
                <option value="commission">{t("admin.finance.commission")}</option>
                <option value="bonus">{t("admin.finance.bonus")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.finance.amount")}</label>
              <input type="number" required min={0} step={0.01} value={formAmount} onChange={(e) => setFormAmount(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.finance.relatedLead")}</label>
              <select value={formLead} onChange={(e) => setFormLead(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">{t("admin.finance.noSpecificLead")}</option>
                {leads.filter((l) => !formAgent || l.agent_id === formAgent).map((l) => (
                  <option key={l.id} value={l.id}>{l.name} — {l.created_at ? new Date(l.created_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US") : ""}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.finance.notes")}</label>
              <input type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("admin.finance.notesPlaceholder")} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={formSaving} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
              {formSaving ? t("admin.finance.saving") : t("admin.finance.addPayment")}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              {t("admin.cancel")}
            </button>
          </div>
        </form>
      )}

      {/* Payments table */}
      {payments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t("admin.finance.noPayments")}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.agent")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.type")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.amountLabel")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.status")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.notesCol")}</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">{t("admin.finance.dateCol")}</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">{t("admin.finance.actionsCol")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const agent = agents.find((a) => a.id === p.agent_id);
                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{agent?.full_name || agent?.email || "—"}</p>
                        <p className="text-xs text-gray-400">{agent?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[p.type]}`}>{typeLabels[p.type]}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold">₪{(p.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {p.status === "paid" ? t("admin.finance.paid") : t("admin.finance.pending")}
                        </span>
                        {p.paid_at && <p className="text-xs text-gray-400 mt-0.5">{new Date(p.paid_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US")}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[160px] truncate">{p.notes || "—"}</td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString(lang === "he" || lang === "ar" ? "he-IL" : "en-US") : "—"}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          {p.status === "pending" && (
                            <button
                              onClick={() => handleMarkPaid(p.id)}
                              disabled={actionLoading === p.id}
                              className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                            >
                              {t("admin.finance.markPaid")}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePayment(p.id)}
                            disabled={actionLoading === p.id}
                            className="text-red-500 hover:text-red-600 font-medium text-sm disabled:opacity-50"
                          >
                            {t("admin.finance.deletePayment")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Admin Page ─────────────── */
const TAB_DEFS: { key: Tab; tKey: string; icon: string }[] = [
  { key: "pending_agents", tKey: "admin.tab.pendingAgents", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "properties", tKey: "admin.tab.properties", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { key: "leads", tKey: "admin.tab.leads", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { key: "closed", tKey: "admin.tab.closed", icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" },
  { key: "agents", tKey: "admin.tab.agents", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
  { key: "users", tKey: "admin.tab.users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { key: "finance", tKey: "admin.tab.finance", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const { properties } = useProperties();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("pending_agents");
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.from("leads").select("*").then(({ data }) => {
      if (data) setLeads(data);
    });
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">{t("admin.loading")}</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("admin.title")}</h1>
          <p className="text-gray-500 mb-6 text-center">{t("admin.signInRequired")}</p>
          <LoginForm />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("admin.accessDenied")}</h1>
        <p className="text-gray-500">{t("admin.accessDeniedSub")}</p>
        <p className="text-gray-400 text-sm mt-1">{t("admin.connectedAs")} {user.email}</p>
      </div>
    );
  }

  const activeProperties = properties.filter((p) => (p.status || "active") === "active");
  const closedProperties = properties.filter((p) => p.status === "closed");

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("admin.title")}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label={t("admin.stat.activeProperties")} value={activeProperties.length} color="text-green-600" />
            <StatCard label={t("admin.stat.totalLeads")} value={leads.length} color="text-blue-600" />
            <StatCard label={t("admin.stat.closedProperties")} value={closedProperties.length} color="text-amber-600" />
            <StatCard label={t("admin.stat.agents")} value={new Set(properties.map((p) => p.agent_email)).size} color="text-purple-600" />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {TAB_DEFS.map((tab) => (
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
              {t(tab.tKey)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "pending_agents" && <PendingAgentsTab />}
        {activeTab === "properties" && <PropertiesTab status="active" />}
        {activeTab === "closed" && <PropertiesTab status="closed" />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "agents" && <AgentsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "finance" && <FinanceTab />}
      </div>
    </>
  );
}
