"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useFavorites } from "@/lib/FavoritesContext";
import { useProperties } from "@/lib/PropertiesContext";
import { supabase } from "@/lib/supabase";
import { Lead, LeadStatus } from "@/lib/types";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

type Tab = "favorites" | "agents" | "leads" | "account";

interface FollowedAgent {
  id: string;
  agent_id: string;
  agent_name: string;
  agent_email: string;
  company?: string;
  properties_count: number;
}

const statusColors: Record<LeadStatus, string> = {
  sent: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  answered: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};


export default function BuyerDashboard() {
  const { user, profile, loading, updateProfile } = useAuth();
  const { t, lang } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  const { properties } = useProperties();
  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [followedAgents, setFollowedAgents] = useState<FollowedAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  // Account form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notifNew, setNotifNew] = useState(true);
  const [notifPrice, setNotifPrice] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setPhone(profile.phone || "");
      setNotifNew(profile.notification_new_properties);
      setNotifPrice(profile.notification_price_changes);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const fetchLeads = async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setLeads(data);
      setLeadsLoading(false);
    };
    fetchLeads();

    const fetchFollowedAgents = async () => {
      const { data: favAgents } = await supabase
        .from("favorite_agents")
        .select("id, agent_id")
        .eq("buyer_id", user.id);
      if (favAgents && favAgents.length > 0) {
        const agentIds = favAgents.map((f: { agent_id: string }) => f.agent_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, company")
          .in("id", agentIds);
        const enriched: FollowedAgent[] = favAgents.map((f: { id: string; agent_id: string }) => {
          const p = profiles?.find((pr: { id: string }) => pr.id === f.agent_id);
          const propCount = properties.filter((prop) => prop.agent_id === f.agent_id).length;
          return {
            id: f.id,
            agent_id: f.agent_id,
            agent_name: p?.full_name || p?.email || "Unknown",
            agent_email: p?.email || "",
            company: p?.company,
            properties_count: propCount,
          };
        });
        setFollowedAgents(enriched);
      }
      setAgentsLoading(false);
    };
    fetchFollowedAgents();
  }, [user, properties]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">{t("properties.loading")}</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("dashboard.buyer.title")}</h1>
          <p className="text-gray-500 mb-6 text-center">{t("dashboard.buyer.signInRequired")}</p>
          <LoginForm />
        </div>
      </div>
    );
  }

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const getPropertyTitle = (id: string) => {
    const prop = properties.find((p) => p.id === id);
    return prop?.title || `#${id}`;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    await updateProfile({
      full_name: name,
      phone,
      notification_new_properties: notifNew,
      notification_price_changes: notifPrice,
    });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendReminder = async (leadId: string) => {
    // For now, just update the lead's updated_at to signal a reminder
    await supabase
      .from("leads")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", leadId);
    alert(t("dashboard.buyer.reminderSent"));
  };

  const tabs = [
    { key: "favorites" as Tab, label: t("dashboard.buyer.favorites"), icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { key: "agents" as Tab, label: t("dashboard.buyer.favoriteAgents"), icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
    { key: "leads" as Tab, label: t("dashboard.buyer.myRequests"), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { key: "account" as Tab, label: t("dashboard.buyer.account"), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{t("dashboard.buyer.title")}</h1>
          <p className="text-primary-200">{t("dashboard.buyer.welcome")}, {profile?.full_name || user.email}</p>
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-xs text-primary-200">{t("dashboard.buyer.savedProperties")}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{leads.length}</p>
              <p className="text-xs text-primary-200">{t("dashboard.buyer.requests")}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{leads.filter(l => l.status === "answered").length}</p>
              <p className="text-xs text-primary-200">{t("dashboard.buyer.answered")}</p>
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
            </button>
          ))}
        </div>

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          favoriteProperties.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("favorites.empty")}</h3>
              <p className="text-gray-500 mb-6">{t("favorites.emptySub")}</p>
              <Link href="/properties" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                {t("favorites.browse")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <span className="absolute top-3 left-3 bg-accent-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {p.expected_roi}% {t("card.roi")}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{p.city}, {p.country}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-700">€{p.price.toLocaleString()}</span>
                      <Link href={`/properties/${p.id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        {t("dashboard.buyer.viewDetails")} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Favorite Agents Tab */}
        {activeTab === "agents" && (
          agentsLoading ? (
            <div className="text-center py-16 text-gray-400">{t("properties.loading")}</div>
          ) : followedAgents.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("dashboard.buyer.noAgents")}</h3>
              <p className="text-gray-500 mb-6">{t("dashboard.buyer.noAgentsSub")}</p>
              <Link href="/properties" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                {t("favorites.browse")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followedAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {agent.agent_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{agent.agent_name}</h3>
                      {agent.company && <p className="text-sm text-gray-500">{agent.company}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {agent.properties_count} {t("dashboard.buyer.listings")}
                    </span>
                    <button
                      onClick={async () => {
                        await supabase.from("favorite_agents").delete().eq("id", agent.id);
                        setFollowedAgents((prev) => prev.filter((a) => a.id !== agent.id));
                      }}
                      className="text-sm font-medium text-red-500 hover:text-red-600"
                    >
                      {t("dashboard.buyer.unfollow")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          leadsLoading ? (
            <div className="text-center py-16 text-gray-400">{t("properties.loading")}</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("dashboard.buyer.noRequests")}</h3>
              <p className="text-gray-500 mb-6">{t("dashboard.buyer.noRequestsSub")}</p>
              <Link href="/properties" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                {t("favorites.browse")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{getPropertyTitle(lead.property_id)}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{lead.message || "—"}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString(lang === "he" ? "he-IL" : "en-US") : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[lead.status || "sent"]}`}>
                        {t(`status.${lead.status || "sent"}`)}
                      </span>
                      {(lead.status === "sent" || lead.status === "in_progress") && (
                        <button
                          onClick={() => handleSendReminder(lead.id!)}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          {t("dashboard.buyer.sendReminder")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="max-w-xl">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="text-lg font-bold text-gray-900">{t("dashboard.buyer.accountDetails")}</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
                <input type="email" disabled value={user.email || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.name")}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("form.namePlaceholder")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.phone")}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t("form.phonePlaceholder")} />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">{t("dashboard.buyer.notifications")}</h4>
                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input type="checkbox" checked={notifNew} onChange={(e) => setNotifNew(e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm text-gray-700">{t("dashboard.buyer.notifNewProperties")}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifPrice} onChange={(e) => setNotifPrice(e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm text-gray-700">{t("dashboard.buyer.notifPriceChanges")}</span>
                </label>
              </div>

              {saveSuccess && (
                <p className="text-accent-600 text-sm font-medium">{t("dashboard.buyer.saved")}</p>
              )}
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
