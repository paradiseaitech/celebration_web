"use client";

import { motion } from "framer-motion";
import { COMPANY } from "@/lib/constants";

const stats = [
  { value: "500+", label: "Events Completed" },
  { value: "50K+", label: "Guests Served" },
  { value: "100+", label: "Menu Items" },
  { value: "4.9★", label: "Client Rating" },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="Nitin Kumar - Founder of Celebration.com"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gold text-navy rounded-lg p-6 hidden lg:block">
              <p className="font-heading text-3xl font-bold">{COMPANY.foundedYear}</p>
              <p className="text-sm font-medium">Established</p>
            </div>
          </div>

          <div>
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
              Our Story
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
              From Purnia, With Love
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Founded in {COMPANY.foundedYear} by <span className="text-gold font-medium">{COMPANY.founder}</span>, 
                Celebration.com started with a simple vision — to bring world-class catering and event 
                management to Purnia and beyond.
              </p>
              <p>
                What began as a small catering service has grown into one of Bihar's most trusted 
                event management companies. Our secret? A deep love for food, an obsession with 
                details, and an unwavering commitment to making every celebration unforgettable.
              </p>
              <p>
                Today, we serve across India, bringing the warmth and richness of Bihari hospitality 
                to weddings, corporate events, and private celebrations of every scale.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-gold">{stat.value}</p>
                  <p className="text-white/50 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
