"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePlateStore } from "@/store/plateStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star, ChevronDown } from "lucide-react";
import { DIETARY_TAGS, GUEST_COUNTS } from "@/lib/constants";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  dietary_tags: string[];
  is_popular: boolean;
  is_seasonal: boolean;
  category_id: string;
  category_name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PlateBuilderProps {
  categories: Category[];
  menuItems: MenuItem[];
}

export function PlateBuilder({ categories, menuItems }: PlateBuilderProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug || "");
  const {
    items,
    guestCount,
    pricingMode,
    addItem,
    removeItem,
    updateQuantity,
    setGuestCount,
    setPricingMode,
    perPlateTotal,
    totalEstimate,
    itemCount,
  } = usePlateStore();

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name || "";

  const filteredItems = menuItems.filter(
    (item) => item.category_name === activeCategoryName
  );

  const isInPlate = (id: string) => items.some((item) => item.id === id);

  return (
    <section id="menu" className="py-24 bg-navy relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Interactive Experience
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Build Your Plate
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Customize your menu, adjust quantities, and see real-time pricing.
            Create the perfect spread for your celebration.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex gap-2 p-1 bg-navy-light rounded-lg">
            <button
              onClick={() => setPricingMode("per-plate")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                pricingMode === "per-plate"
                  ? "bg-gold text-navy"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Per Plate
            </button>
            <button
              onClick={() => setPricingMode("package")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                pricingMode === "package"
                  ? "bg-gold text-navy"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Package
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">Guests:</span>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="bg-navy-light border border-white/20 text-white rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {GUEST_COUNTS.map((count) => (
                <option key={count} value={count}>
                  {count.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.slug
                      ? "bg-gold/10 text-gold border-l-4 border-gold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const selected = isInPlate(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className={`bg-navy-light rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selected ? "border-gold shadow-lg shadow-gold/10" : "border-transparent"
                    }`}
                  >
                    <div className="h-48 overflow-hidden relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                          <span className="text-4xl">🍽️</span>
                        </div>
                      )}
                      {item.is_popular && (
                        <div className="absolute top-3 right-3 bg-gold text-navy px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Popular
                        </div>
                      )}
                      {item.is_seasonal && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Seasonal
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-semibold text-white text-lg">
                          {item.name}
                        </h3>
                        <span className="text-gold font-bold text-lg">₹{item.price}</span>
                      </div>

                      <p className="text-white/50 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      {item.dietary_tags && item.dietary_tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.dietary_tags.map((tag: string) => {
                            const tagInfo = DIETARY_TAGS[tag as keyof typeof DIETARY_TAGS];
                            return tagInfo ? (
                              <Badge key={tag} variant="gold" className="text-xs">
                                {tagInfo.emoji} {tagInfo.label}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}

                      {selected ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const existing = items.find((i) => i.id === item.id);
                              if (existing && existing.quantity > 1) {
                                updateQuantity(item.id, existing.quantity - 1);
                              } else {
                                removeItem(item.id);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-white font-medium w-6 text-center">
                            {items.find((i) => i.id === item.id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (items.find((i) => i.id === item.id)?.quantity || 0) + 1)}
                            className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/30 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gold" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            addItem({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              category: item.category_name,
                            })
                          }
                          className="w-full py-2.5 rounded-lg border-2 border-gold text-gold font-medium hover:bg-gold hover:text-navy transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add to Plate
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t border-gold/20 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 min-w-fit">
                      <span className="text-charcoal font-medium text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1);
                            } else {
                              removeItem(item.id);
                            }
                          }}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-gold font-semibold">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {itemCount()} items · ₹{perPlateTotal()}/plate
                    </p>
                    <p className="text-xl font-bold text-navy">
                      ₹{totalEstimate().toLocaleString()}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        ({guestCount.toLocaleString()} guests)
                      </span>
                    </p>
                  </div>
                  <a href="#contact">
                    <Button className="bg-gold text-navy hover:bg-gold-hover">
                      Get Quote
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
