"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  color_scheme: string | null;
}

interface ThemesSectionProps {
  themes: Theme[];
}

export function ThemesSection({ themes }: ThemesSectionProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <section id="themes" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Visual Styles
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Event Themes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose a theme that matches your vision. Each can be customized to perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelectedTheme(selectedTheme === theme.id ? null : theme.id)}
              className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                selectedTheme === theme.id
                  ? "ring-4 ring-gold shadow-xl scale-[1.02]"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="relative h-64">
                {theme.image_url ? (
                  <img
                    src={theme.image_url}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: theme.color_scheme || "#333" }}
                  >
                    <span className="text-white text-2xl font-heading font-bold">{theme.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-heading font-bold text-white mb-1">{theme.name}</h3>
                  <p className="text-white/70 text-sm line-clamp-2">{theme.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#contact">
            <Button className="bg-navy text-white hover:bg-navy-light">
              Customize Your Theme
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
