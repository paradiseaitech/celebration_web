"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, Star } from "lucide-react";

const VENDOR_CATEGORIES = [
  { value: "decorator", label: "Decorator" },
  { value: "photographer", label: "Photographer" },
  { value: "dj", label: "DJ & Music" },
  { value: "makeup", label: "Makeup Artist" },
  { value: "venue", label: "Venue" },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    setVendors(data || []);
    setLoading(false);
  }

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this vendor?")) return;
    await supabase.from("vendors").delete().eq("id", id);
    fetchVendors();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy">Vendors</h1>
          <p className="text-gray-500 mt-1">Manage event vendors</p>
        </div>
        <Button
          onClick={() => { setEditingVendor(null); setShowForm(true); }}
          className="bg-gold text-navy hover:bg-gold-hover"
        >
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      {showForm && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => setShowForm(false)}
          onSave={() => { fetchVendors(); setShowForm(false); }}
        />
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {filtered.map((vendor) => (
            <div key={vendor.id} className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {vendor.image_url ? (
                  <img src={vendor.image_url} alt={vendor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏢</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-charcoal truncate">{vendor.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{vendor.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-3.5 h-3.5 text-gold fill-current" />
                  <span className="text-sm text-gray-600">{vendor.rating || "—"}</span>
                  {vendor.is_featured && (
                    <span className="px-2 py-0.5 bg-gold/10 text-gold-dark text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                  {!vendor.is_active && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <span className="text-lg font-bold text-gold">
                ₹{(vendor.price_from || 0).toLocaleString()}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditingVendor(vendor); setShowForm(true); }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(vendor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VendorForm({
  vendor,
  onClose,
  onSave,
}: {
  vendor: any;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    category: vendor?.category || "decorator",
    description: vendor?.description || "",
    image_url: vendor?.image_url || "",
    price_from: vendor?.price_from?.toString() || "",
    rating: vendor?.rating?.toString() || "0",
    is_featured: vendor?.is_featured || false,
    is_active: vendor?.is_active ?? true,
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price_from: parseFloat(formData.price_from) || 0,
      rating: parseFloat(formData.rating) || 0,
    };

    if (vendor?.id) {
      await supabase.from("vendors").update(data).eq("id", vendor.id);
    } else {
      await supabase.from("vendors").insert(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-navy">{vendor ? "Edit" : "Add"} Vendor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-md bg-white"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          {VENDOR_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-charcoal">Description</label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Price From (₹)"
          type="number"
          value={formData.price_from}
          onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
        />
        <Input
          label="Rating (0-5)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />
        <Input
          label="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="rounded border-gray-300 text-gold focus:ring-gold"
          />
          <span className="text-sm">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="rounded border-gray-300 text-gold focus:ring-gold"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="bg-gold text-navy hover:bg-gold-hover">
          {vendor ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
