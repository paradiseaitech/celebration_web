"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
  price_from: number | null;
  rating: number | null;
  is_featured: boolean;
}

interface VendorsSectionProps {
  vendors: Vendor[];
}

const categoryFilters = [
  { value: "all", label: "All", icon: "✨" },
  { value: "decorator", label: "Decorators", icon: "🎨" },
  { value: "photographer", label: "Photographers", icon: "📸" },
  { value: "dj", label: "DJs & Music", icon: "🎵" },
  { value: "makeup", label: "Makeup Artists", icon: "💄" },
  { value: "venue", label: "Venues", icon: "🏛️" },
];

export function VendorsSection({ vendors }: VendorsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "all"
    ? vendors
    : vendors.filter((v) => v.category === activeCategory);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section id="vendors" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Our Partners
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted Vendors
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Carefully curated vendors who deliver excellence for every celebration.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-start sm:justify-center">
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === cat.value
                  ? "bg-gold text-navy shadow-lg shadow-gold/20"
                  : "bg-navy-light/60 text-white/50 hover:text-white hover:bg-navy-light"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy-light/80 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-navy-light transition-colors hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filtered.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-navy-light rounded-xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  {vendor.image_url ? (
                    <img
                      src={vendor.image_url}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-4xl">
                      {categoryFilters.find((c) => c.value === vendor.category)?.icon || "🏢"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-light to-transparent" />
                  {vendor.is_featured && (
                    <div className="absolute top-3 left-3 bg-gold text-navy px-2 py-0.5 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge
                      variant="gold"
                      className="text-xs capitalize"
                    >
                      {vendor.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-base leading-tight">{vendor.name}</h3>
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating || "—"} </span>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{vendor.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white/40 text-xs">From</span>
                      <p className="text-gold font-bold">
                        ₹{(vendor.price_from || 0).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs border-white/20 text-white hover:bg-gold hover:text-navy hover:border-gold">
                      <Phone className="w-3.5 h-3.5 mr-1" /> Contact
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy-light/80 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-navy-light transition-colors hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-10">
          <a href="#contact">
            <Button variant="outline" className="border-white/20 text-white hover:bg-gold hover:text-navy hover:border-gold">
              Request Custom Vendor <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
