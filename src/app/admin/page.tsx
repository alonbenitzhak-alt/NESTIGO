"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import LoginForm from "@/components/LoginForm";
import { useProperties } from "@/lib/PropertiesContext";
import { Property, Lead, Payment, PaymentStatus, PaymentType } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type Tab = "properties" | "closed" | "leads" | "agents" | "users" | "pending_agents" | "finance";

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
  const [form, setForm] = useState<Property>(
    property || {
      id: Date.now().toString(),
      title: "",
      country: "Greece",
      city: "",
      price: 0,
      expected_roi: 0,
      bedrooms: 1,
      property_type: "Apartment",
      description: "",
      images: ["", "", ""],
      agent_name: "",
      agent_email: "",
      status: "active",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        {property ? "Edit Property" : "Add New Property"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="Greece">Greece</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Georgia">Georgia</option>
            <option value="Portugal">Portugal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
          <input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI (%)</label>
          <input type="number" required min={0} step={0.1} value={form.expected_roi} onChange={(e) => setForm({ ...form, expected_roi: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <input type="number" required min={1} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
            <option value="Condo">Condo</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <input type="text" required value={form.agent_name} onChange={(e) => setForm({ ...form, agent_name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Email</label>
          <input type="email" required value={form.agent_email} onChange={(e) => setForm({ ...form, agent_email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status || "active"} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "closed" })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
        <textarea rows={3} value={form.images.join("\n")} onChange={(e) => setForm({ ...form, images: e.target.value.split("\n").filter(Boolean) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="https://images.unsplash.com/..." />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
          {property ? "Update Property" : "Add Property"}
        </button>
        <button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
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
    if (confirm("Are you sure you want to delete this property?")) {
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
            Add New Property
          </button>
        )
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No {status} properties
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Property</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Location</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">ROI</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(p); setShowForm(false); }} className="text-primary-600 hover:text-primary-700 font-medium">Edit</button>
                        <button onClick={() => handleToggleStatus(p)} className={`font-medium ${status === "active" ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"}`}>
                          {status === "active" ? "Close" : "Reopen"}
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
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
    if (!id) return "General Inquiry";
    const prop = properties.find((p) => p.id === id);
    return prop?.title || `Property #${id}`;
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Loading leads...</div>;

  return leads.length === 0 ? (
    <div className="text-center py-16 text-gray-400">No leads yet</div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Phone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Budget</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Property</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Message</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
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
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString("he-IL") : "—"}
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
    <div className="text-center py-16 text-gray-400">No agents found</div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Agent</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Country</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">City</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Properties</th>
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
function PendingAgentsTab() {
  const [agents, setAgents] = useState<{ id: string; email: string; full_name: string; phone: string; company: string; license_url: string | null; id_url: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, company, license_url, id_url, created_at")
        .eq("role", "agent")
        .or("approved.is.null,approved.eq.false")
        .order("created_at", { ascending: false });
      if (data) setAgents(data);
      setLoading(false);
    };
    fetch();
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
    if (!confirm("Are you sure you want to reject this agent?")) return;
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

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>;

  return agents.length === 0 ? (
    <div className="text-center py-16 text-gray-400">
      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No pending agent applications</p>
    </div>
  ) : (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-white rounded-2xl border border-amber-200 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">Pending Approval</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{agent.full_name || "—"}</h3>
              <p className="text-sm text-gray-600">{agent.email}</p>
              {agent.company && <p className="text-sm text-gray-500">{agent.company}</p>}
              {agent.phone && <p className="text-sm text-gray-500">{agent.phone}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Registered: {new Date(agent.created_at).toLocaleDateString("he-IL")}
              </p>
              <div className="flex gap-3 mt-2 flex-wrap">
                {agent.license_url && (
                  <a
                    href={agent.license_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    רישיון תיווך
                  </a>
                )}
                {agent.id_url && (
                  <a
                    href={agent.id_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                    </svg>
                    תעודת זהות
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleApprove(agent.id)}
                disabled={actionLoading === agent.id}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => handleReject(agent.id)}
                disabled={actionLoading === agent.id}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Users Tab ─────────────── */
function UsersTab() {
  const [users, setUsers] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center py-16 text-gray-400">Loading users...</div>;

  return users.length === 0 ? (
    <div className="text-center py-16 text-gray-400">
      <p className="mb-2">No registered users found</p>
      <p className="text-sm">Create a &quot;profiles&quot; table in Supabase with a trigger on auth.users to track registrations</p>
    </div>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{u.email}</td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(u.created_at).toLocaleDateString("he-IL")}
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
    if (!confirm("למחוק תשלום זה?")) return;
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
    const headers = ["סוכן", "אימייל", "סוג", "סכום", "סטטוס", "הערות", "תאריך"];
    const rows = payments.map((p) => {
      const agent = agents.find((a) => a.id === p.agent_id);
      return [
        agent?.full_name || "", agent?.email || "",
        p.type, p.amount, p.status, p.notes || "",
        p.created_at ? new Date(p.created_at).toLocaleDateString("he-IL") : "",
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-16 text-gray-400">טוען נתוני כספים...</div>;

  const typeLabels: Record<PaymentType, string> = { lead_fee: "דמי ליד", commission: "עמלה", bonus: "בונוס" };
  const typeColors: Record<PaymentType, string> = { lead_fee: "bg-blue-100 text-blue-700", commission: "bg-purple-100 text-purple-700", bonus: "bg-amber-100 text-amber-700" };

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">סה״כ חויב</p>
          <p className="text-3xl font-bold text-blue-600">₪{totalOwed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">שולם</p>
          <p className="text-3xl font-bold text-green-600">₪{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">ממתין לתשלום</p>
          <p className="text-3xl font-bold text-amber-600">₪{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Per-agent summary */}
      {agentSummaries.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">סיכום לפי סוכן</h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">סוכן</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">לידים</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">סה״כ חויב</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">שולם</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">יתרה</th>
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
        <h3 className="text-lg font-bold text-gray-900">פירוט תשלומים</h3>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="text-sm font-medium text-primary-600 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            ייצוא CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            הוסף תשלום
          </button>
        </div>
      </div>

      {/* Add payment form */}
      {showForm && (
        <form onSubmit={handleAddPayment} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 space-y-4">
          <h4 className="font-bold text-gray-900">הוספת תשלום / עמלה</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוכן</label>
              <select required value={formAgent} onChange={(e) => setFormAgent(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">בחר סוכן...</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name || a.email}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value as PaymentType)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="lead_fee">דמי ליד</option>
                <option value="commission">עמלה</option>
                <option value="bonus">בונוס</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סכום (₪)</label>
              <input type="number" required min={0} step={0.01} value={formAmount} onChange={(e) => setFormAmount(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ליד קשור (אופציונלי)</label>
              <select value={formLead} onChange={(e) => setFormLead(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">ללא ליד ספציפי</option>
                {leads.filter((l) => !formAgent || l.agent_id === formAgent).map((l) => (
                  <option key={l.id} value={l.id}>{l.name} — {l.created_at ? new Date(l.created_at).toLocaleDateString("he-IL") : ""}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
              <input type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="הערה כלשהי..." />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={formSaving} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
              {formSaving ? "שומר..." : "הוסף תשלום"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              ביטול
            </button>
          </div>
        </form>
      )}

      {/* Payments table */}
      {payments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">אין תשלומים עדיין</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">סוכן</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">סוג</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">סכום</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">סטטוס</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">הערות</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">תאריך</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">פעולות</th>
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
                          {p.status === "paid" ? "שולם" : "ממתין"}
                        </span>
                        {p.paid_at && <p className="text-xs text-gray-400 mt-0.5">{new Date(p.paid_at).toLocaleDateString("he-IL")}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[160px] truncate">{p.notes || "—"}</td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString("he-IL") : "—"}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          {p.status === "pending" && (
                            <button
                              onClick={() => handleMarkPaid(p.id)}
                              disabled={actionLoading === p.id}
                              className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                            >
                              סמן כשולם
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePayment(p.id)}
                            disabled={actionLoading === p.id}
                            className="text-red-500 hover:text-red-600 font-medium text-sm disabled:opacity-50"
                          >
                            מחק
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
const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "pending_agents", label: "סוכנים ממתינים", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "properties", label: "נכסים פעילים", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { key: "leads", label: "לידים", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { key: "closed", label: "נכסים סגורים", icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" },
  { key: "agents", label: "סוכנים", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
  { key: "users", label: "משתמשים", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { key: "finance", label: "כספים", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const { properties } = useProperties();
  const [activeTab, setActiveTab] = useState<Tab>("properties");
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.from("leads").select("*").then(({ data }) => {
      if (data) setLeads(data);
    });
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Panel</h1>
          <p className="text-gray-500 mb-6 text-center">Sign in to access the admin panel</p>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500">You don&apos;t have permission to access the admin panel.</p>
        <p className="text-gray-400 text-sm mt-1">Signed in as: {user.email}</p>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Portal</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Active Properties" value={activeProperties.length} color="text-green-600" />
            <StatCard label="Total Leads" value={leads.length} color="text-blue-600" />
            <StatCard label="Closed Properties" value={closedProperties.length} color="text-amber-600" />
            <StatCard label="Agents" value={new Set(properties.map((p) => p.agent_email)).size} color="text-purple-600" />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
