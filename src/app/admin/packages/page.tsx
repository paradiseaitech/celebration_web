"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [{ data: pkgs }, { data: items }] = await Promise.all([
      supabase.from("packages").select("*").order("base_price"),
      supabase.from("menu_items").select("id, name").eq("is_active", true),
    ]);
    setPackages(pkgs || []);
    setMenuItems(items || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this package?")) return;
    await supabase.from("packages").delete().eq("id", id);
    fetchData();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy">Packages</h1>
          <p className="text-gray-500 mt-1">Pre-built menu packages</p>
        </div>
        <Button
          onClick={() => { setEditingPackage(null); setShowForm(true); }}
          className="bg-gold text-navy hover:bg-gold-hover"
        >
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>

      {showForm && (
        <PackageForm
          pkg={editingPackage}
          menuItems={menuItems}
          onClose={() => setShowForm(false)}
          onSave={() => { fetchData(); setShowForm(false); }}
        />
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-heading font-bold text-navy">{pkg.name}</h3>
                <span className="text-2xl font-bold text-gold">₹{pkg.base_price}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>Min Guests: {pkg.min_guests}</p>
                <p>Max Guests: {pkg.max_guests || "Unlimited"}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {pkg.is_active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditingPackage(pkg); setShowForm(true); }}
                >
                  <Edit className="w-4 h-4" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(pkg.id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PackageForm({
  pkg,
  menuItems,
  onClose,
  onSave,
}: {
  pkg: any;
  menuItems: any[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: pkg?.name || "",
    description: pkg?.description || "",
    base_price: pkg?.base_price?.toString() || "",
    min_guests: pkg?.min_guests?.toString() || "",
    max_guests: pkg?.max_guests?.toString() || "",
    image_url: pkg?.image_url || "",
    is_active: pkg?.is_active ?? true,
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      base_price: parseFloat(formData.base_price) || 0,
      min_guests: parseInt(formData.min_guests) || 0,
      max_guests: parseInt(formData.max_guests) || null,
    };

    if (pkg?.id) {
      await supabase.from("packages").update(data).eq("id", pkg.id);
    } else {
      await supabase.from("packages").insert(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-navy">{pkg ? "Edit" : "Add"} Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Base Price (₹/plate)"
          type="number"
          value={formData.base_price}
          onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
          required
        />
        <Input
          label="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-charcoal">Description</label>
        <textarea
          rows={2}
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Min Guests"
          type="number"
          value={formData.min_guests}
          onChange={(e) => setFormData({ ...formData, min_guests: e.target.value })}
          required
        />
        <Input
          label="Max Guests (optional)"
          type="number"
          value={formData.max_guests}
          onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="rounded border-gray-300 text-gold focus:ring-gold"
        />
        <span className="text-sm">Active</span>
      </label>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="bg-gold text-navy hover:bg-gold-hover">
          {pkg ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
