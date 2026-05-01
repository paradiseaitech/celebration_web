"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlateStore } from "@/store/plateStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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

function ItemModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { addItem, updateQuantity, removeItem, items } = usePlateStore();
  const existing = items.find((i) => i.id === item?.id);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="w-4 h-4 text-navy" />
        </button>

        <div className="h-64 relative">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy/10 to-navy/5 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          {item.is_popular && (
            <div className="absolute top-4 left-4 bg-gold text-navy px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Popular
            </div>
          )}
          {item.is_seasonal && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Seasonal
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-heading text-2xl font-bold text-navy">{item.name}</h3>
            <span className="text-gold font-bold text-2xl">₹{item.price}</span>
          </div>

          {item.dietary_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.dietary_tags.map((tag) => {
                const tagInfo = DIETARY_TAGS[tag as keyof typeof DIETARY_TAGS];
                return tagInfo ? (
                  <Badge key={tag} variant="gold" className="text-xs">
                    {tagInfo.emoji} {tagInfo.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>

          {existing ? (
            <div className="flex items-center justify-center gap-5 py-3 bg-navy/5 rounded-xl">
              <span className="text-navy font-medium">In your plate:</span>
              <button
                onClick={() => {
                  if (existing.quantity > 1) {
                    updateQuantity(item.id, existing.quantity - 1);
                  } else {
                    removeItem(item.id);
                  }
                }}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4 text-navy" />
              </button>
              <span className="text-navy font-bold text-lg w-8 text-center">{existing.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, existing.quantity + 1)}
                className="w-10 h-10 rounded-full bg-gold shadow-md flex items-center justify-center hover:bg-gold-hover transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                addItem({ id: item.id, name: item.name, price: item.price, category: item.category_name })
              }
              className="w-full py-3.5 rounded-xl bg-gold text-navy font-semibold hover:bg-gold-hover transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <Plus className="w-5 h-5" /> Add to Plate
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function PlateBuilder({ categories, menuItems }: PlateBuilderProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug || "");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filterType, setFilterType] = useState<"all" | "veg" | "nonveg">("all");
  const [showFilter, setShowFilter] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
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
  const categoryItems = menuItems.filter((item) => item.category_name === activeCategoryName);

  const filteredItems = categoryItems.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "veg") return item.dietary_tags.includes("veg");
    return !item.dietary_tags.includes("veg");
  });

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) contactSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="menu" className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Interactive Experience
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Build Your Plate
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Browse categories, tap to add, and see real-time pricing for your celebration.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex gap-1.5 p-1 bg-navy-light rounded-xl">
            <button
              onClick={() => setPricingMode("per-plate")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                pricingMode === "per-plate" ? "bg-gold text-navy" : "text-white/50 hover:text-white"
              }`}
            >
              Per Plate
            </button>
            <button
              onClick={() => setPricingMode("package")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                pricingMode === "package" ? "bg-gold text-navy" : "text-white/50 hover:text-white"
              }`}
            >
              Package
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm">Guests:</span>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="bg-navy-light border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {GUEST_COUNTS.map((count) => (
                <option key={count} value={count}>
                  {count.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {pricingMode === "per-plate" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1 max-w-full">
                {categories.map((category) => {
                  const count = menuItems.filter(
                    (item) => item.category_name === category.name
                  ).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.slug)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                        activeCategory === category.slug
                          ? "bg-gold text-navy shadow-lg shadow-gold/20"
                          : "bg-navy-light/60 text-white/50 hover:text-white hover:bg-navy-light"
                      }`}
                    >
                      {category.name}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-md ${
                          activeCategory === category.slug ? "bg-navy/20" : "bg-white/10"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-shrink-0 ml-3">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`p-2.5 rounded-xl transition-all ${
                    filterType !== "all"
                      ? "bg-gold/20 text-gold"
                      : "bg-navy-light/60 text-white/40 hover:text-white"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl p-2 z-30 min-w-40"
                    >
                      {[
                        { value: "all" as const, label: "All Items", emoji: "" },
                        { value: "veg" as const, label: "Veg Only", emoji: "🟢" },
                        { value: "nonveg" as const, label: "Non-Veg Only", emoji: "🔴" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilterType(option.value);
                            setShowFilter(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filterType === option.value
                              ? "bg-gold/10 text-navy font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {option.emoji} {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy-light/80 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-navy-light transition-colors hidden sm:flex"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                ref={carouselRef}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredItems.length === 0 ? (
                  <div className="flex-1 text-center py-16">
                    <p className="text-white/40 text-lg">No items found for this filter.</p>
                    <button
                      onClick={() => setFilterType("all")}
                      className="mt-3 text-gold text-sm hover:text-gold-hover transition-colors"
                    >
                      Clear filter
                    </button>
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const isInPlate = items.some((i) => i.id === item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="snap-center flex-shrink-0 w-36 sm:w-44 text-center group relative"
                      >
                        <div
                          className={`relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
                            isInPlate
                              ? "ring-4 ring-gold shadow-lg shadow-gold/30"
                              : "ring-2 ring-white/10 hover:ring-white/30"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center">
                              <span className="text-3xl">🍽️</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 text-center">
                              View
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isInPlate) {
                                removeItem(item.id);
                              } else {
                                addItem({ id: item.id, name: item.name, price: item.price, category: item.category_name });
                              }
                            }}
                            className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-10 ${
                              isInPlate
                                ? "bg-green-500 text-white scale-100"
                                : "bg-gold text-navy hover:bg-gold-hover hover:scale-110"
                            }`}
                          >
                            {isInPlate ? (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </motion.svg>
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>

                          {item.is_popular && (
                            <div className="absolute top-1 right-1 bg-gold text-navy w-5 h-5 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                          )}
                        </div>

                        <h4
                          className="mt-3 text-white font-semibold text-sm leading-tight cursor-pointer hover:text-gold transition-colors truncate px-2"
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.name}
                        </h4>
                        <p className="text-gold font-bold text-sm mt-1">₹{item.price}</p>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy-light/80 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-navy-light transition-colors hidden sm:flex"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence>
              {selectedItem && (
                <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-white/60 text-lg mb-8 text-center max-w-xl">
              Choose from our pre-built packages for a complete dining experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              {[
                { name: "Silver", price: 350, features: ["3 Starters", "4 Main Course", "2 Desserts", "2 Beverages"] },
                { name: "Gold", price: 550, features: ["5 Starters", "6 Main Course", "4 Desserts", "3 Beverages", "Premium Setup"], popular: true },
                { name: "Platinum", price: 850, features: ["8 Starters", "8 Main Course", "6 Desserts", "4 Beverages", "Live Counters", "Premium Bar"] },
              ].map((pkg) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative bg-navy-light rounded-2xl p-6 border-2 transition-all ${
                    pkg.popular ? "border-gold shadow-lg shadow-gold/10" : "border-white/10"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy px-3 py-0.5 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h3 className="font-heading text-xl font-bold text-white mb-1">{pkg.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gold">₹{pkg.price}</span>
                      <span className="text-white/40 text-sm">/plate</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                        <svg className="w-3.5 h-3.5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      usePlateStore.getState().clearPlate();
                      usePlateStore.getState().setSelectedPackageId(pkg.name);
                      const contact = document.getElementById("contact");
                      if (contact) contact.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      pkg.popular
                        ? "bg-gold text-navy hover:bg-gold-hover"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Select {pkg.name}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {pricingMode === "per-plate" && items.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t border-gold/20 z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-x-auto flex-1 pb-1">
                  <span className="text-navy font-semibold text-sm flex-shrink-0">
                    {itemCount()} items · ₹{perPlateTotal()}/plate
                  </span>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 flex-shrink-0">
                      <span className="text-charcoal text-xs font-medium">{item.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                          className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-medium w-3 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold/30"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-gold font-semibold text-xs">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-bold text-navy">
                      ₹{totalEstimate().toLocaleString()}
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        ({guestCount.toLocaleString()} guests)
                      </span>
                    </p>
                  </div>
                  <Button onClick={scrollToContact} className="bg-gold text-navy hover:bg-gold-hover">
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
