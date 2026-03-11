"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import LoginForm from "@/components/LoginForm";
import { properties as initialProperties } from "@/data/properties";
import { Property } from "@/lib/types";

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
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="Greece">Greece</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Georgia">Georgia</option>
            <option value="Portugal">Portugal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI (%)</label>
          <input
            type="number"
            required
            min={0}
            step={0.1}
            value={form.expected_roi}
            onChange={(e) => setForm({ ...form, expected_roi: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <input
            type="number"
            required
            min={1}
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={form.property_type}
            onChange={(e) => setForm({ ...form, property_type: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
            <option value="Condo">Condo</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <input
            type="text"
            required
            value={form.agent_name}
            onChange={(e) => setForm({ ...form, agent_name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Email</label>
          <input
            type="email"
            required
            value={form.agent_email}
            onChange={(e) => setForm({ ...form, agent_email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
        <textarea
          rows={3}
          value={form.images.join("\n")}
          onChange={(e) => setForm({ ...form, images: e.target.value.split("\n").filter(Boolean) })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
        >
          {property ? "Update Property" : "Add Property"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [propertyList, setPropertyList] = useState<Property[]>(initialProperties);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading...
      </div>
    );
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

  const handleSave = (property: Property) => {
    if (editing) {
      setPropertyList((prev) => prev.map((p) => (p.id === property.id ? property : p)));
    } else {
      setPropertyList((prev) => [...prev, property]);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setPropertyList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-primary-100 text-lg">
            Manage properties ({propertyList.length} total)
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Add/Edit Form */}
        {(showForm || editing) ? (
          <div className="mb-8">
            <PropertyForm
              property={editing || undefined}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setShowForm(false); }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Property
          </button>
        )}

        {/* Property List */}
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
                {propertyList.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-900 line-clamp-1">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.city}, {p.country}</td>
                    <td className="px-6 py-4 font-medium">€{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-accent-600 font-semibold">{p.expected_roi}%</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.property_type}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditing(p); setShowForm(false); }}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-500 hover:text-red-600 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
