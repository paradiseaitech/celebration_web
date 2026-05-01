"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", category: "wedding", title: "Elegant Wedding Setup" },
  { src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80", category: "catering", title: "Gourmet Plating" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", category: "corporate", title: "Corporate Gala" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", category: "wedding", title: "Grand Reception" },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", category: "private", title: "Birthday Celebration" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", category: "catering", title: "Food Spread" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", category: "wedding", title: "Wedding Ceremony" },
  { src: "https://images.unsplash.com/photo-1470753937643-efeb931253a7?w=800&q=80", category: "corporate", title: "Business Event" },
  { src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80", category: "private", title: "Private Dinner" },
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filtered = activeFilter === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeFilter);

  const filters = [
    { value: "all", label: "All" },
    { value: "wedding", label: "Weddings" },
    { value: "corporate", label: "Corporate" },
    { value: "private", label: "Private" },
    { value: "catering", label: "Catering" },
  ];

  return (
    <section id="gallery" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Our Work
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Our Celebrations
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.value
                  ? "bg-navy text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer break-inside-avoid"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 rounded-lg flex items-center justify-center">
                <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-navy/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
}
