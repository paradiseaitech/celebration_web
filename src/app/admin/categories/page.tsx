"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("display_order");
    setCategories(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Menu items in this category will not be deleted.")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy">Categories</h1>
          <p className="text-gray-500 mt-1">Manage menu sections</p>
        </div>
        <Button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="bg-gold text-navy hover:bg-gold-hover"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setShowForm(false)}
          onSave={() => { fetchCategories(); setShowForm(false); }}
        />
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-gray-300" />
              <div className="flex-1">
                <h3 className="font-medium text-charcoal">{cat.name}</h3>
                <p className="text-sm text-gray-500">/{cat.slug}</p>
              </div>
              <span className="text-sm text-gray-500">Order: {cat.display_order}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cat.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {cat.is_active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(cat.id)}
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

function CategoryForm({
  category,
  onClose,
  onSave,
}: {
  category: any;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    display_order: category?.display_order?.toString() || "0",
    is_active: category?.is_active ?? true,
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      display_order: parseInt(formData.display_order) || 0,
    };

    if (category?.id) {
      await supabase.from("categories").update(data).eq("id", category.id);
    } else {
      await supabase.from("categories").insert(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-navy">{category ? "Edit" : "Add"} Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
          required
        />
        <Input
          label="Display Order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
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
          {category ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
