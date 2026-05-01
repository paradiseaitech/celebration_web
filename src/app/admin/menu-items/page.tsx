"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [{ data: items }, { data: cats }] = await Promise.all([
      supabase.from("menu_items").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("display_order"),
    ]);
    setMenuItems(items || []);
    setCategories(cats || []);
    setLoading(false);
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy">Menu Items</h1>
          <p className="text-gray-500 mt-1">Manage your catering menu</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="bg-gold text-navy hover:bg-gold-hover"
        >
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {showForm && (
        <MenuItemForm
          categories={categories}
          item={editingItem}
          onClose={() => setShowForm(false)}
          onSave={() => {
            fetchData();
            setShowForm(false);
          }}
        />
      )}

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-md bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-charcoal truncate">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.categories?.name}</p>
                <div className="flex gap-2 mt-1">
                  {item.is_popular && <Badge variant="gold">★ Popular</Badge>}
                  {item.is_seasonal && <Badge variant="green">Seasonal</Badge>}
                  {!item.is_active && <Badge variant="gray">Inactive</Badge>}
                </div>
              </div>
              <span className="text-lg font-bold text-gold">₹{item.price}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingItem(item);
                    setShowForm(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
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

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    fetchData();
  }
}

function MenuItemForm({
  categories,
  item,
  onClose,
  onSave,
}: {
  categories: any[];
  item: any;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price?.toString() || "",
    category_id: item?.category_id || categories[0]?.id || "",
    image_url: item?.image_url || "",
    dietary_tags: item?.dietary_tags || [],
    is_popular: item?.is_popular || false,
    is_seasonal: item?.is_seasonal || false,
    is_active: item?.is_active ?? true,
  });

  const supabase = createClient();

  const dietaryOptions = [
    { value: "veg", label: "🟢 Veg" },
    { value: "vegan", label: "🌱 Vegan" },
    { value: "gluten-free", label: "🌾 Gluten-Free" },
    { value: "egg", label: "🥚 Contains Egg" },
    { value: "spicy", label: "🔥 Spicy" },
    { value: "nut", label: "🥜 Contains Nuts" },
  ];

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter((t: string) => t !== tag)
        : [...prev.dietary_tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };

    if (item?.id) {
      await supabase.from("menu_items").update(data).eq("id", item.id);
    } else {
      await supabase.from("menu_items").insert(data);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-navy">{item ? "Edit" : "Add"} Menu Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <select
          className="w-full px-4 py-3 border border-gray-200 rounded-md bg-white"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <Input
          label="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">Dietary Tags</label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggleTag(tag.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                formData.dietary_tags.includes(tag.value)
                  ? "bg-gold/10 border-gold text-gold-dark"
                  : "border-gray-200 text-gray-500 hover:border-gold"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_popular}
            onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
            className="rounded border-gray-300 text-gold focus:ring-gold"
          />
          <span className="text-sm">Popular</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_seasonal}
            onChange={(e) => setFormData({ ...formData, is_seasonal: e.target.checked })}
            className="rounded border-gray-300 text-gold focus:ring-gold"
          />
          <span className="text-sm">Seasonal</span>
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
          {item ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
