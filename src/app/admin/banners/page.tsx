"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    const { data } = await supabase.from("banners").select("*").order("display_order");
    setBanners(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    fetchBanners();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy">Banners</h1>
          <p className="text-gray-500 mt-1">Manage promotional banners</p>
        </div>
        <Button
          onClick={() => { setEditingBanner(null); setShowForm(true); }}
          className="bg-gold text-navy hover:bg-gold-hover"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => setShowForm(false)}
          onSave={() => { fetchBanners(); setShowForm(false); }}
        />
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🖼️</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-charcoal">{banner.title}</h3>
                <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {banner.is_active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditingBanner(banner); setShowForm(true); }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(banner.id)}
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

function BannerForm({
  banner,
  onClose,
  onSave,
}: {
  banner: any;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image_url: banner?.image_url || "",
    cta_text: banner?.cta_text || "",
    cta_link: banner?.cta_link || "",
    display_order: banner?.display_order?.toString() || "0",
    start_date: banner?.start_date || "",
    end_date: banner?.end_date || "",
    is_active: banner?.is_active ?? true,
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      display_order: parseInt(formData.display_order) || 0,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    };

    if (banner?.id) {
      await supabase.from("banners").update(data).eq("id", banner.id);
    } else {
      await supabase.from("banners").insert(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-navy">{banner ? "Edit" : "Add"} Banner</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Input
          label="Subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
        />
      </div>
      <Input
        label="Image URL"
        value={formData.image_url}
        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        placeholder="https://..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="CTA Text"
          value={formData.cta_text}
          onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
        />
        <Input
          label="CTA Link"
          value={formData.cta_link}
          onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
          placeholder="/#contact"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Display Order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
        />
        <Input
          label="Start Date"
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
        <Input
          label="End Date"
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
          {banner ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
