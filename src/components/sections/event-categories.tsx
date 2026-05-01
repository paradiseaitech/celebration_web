"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const events = [
  {
    title: "Weddings",
    guests: "50–5000 guests",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    description: "Grand celebrations with bespoke menus and flawless execution",
  },
  {
    title: "Corporate Events",
    guests: "20–2000 guests",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
    description: "Professional catering for conferences, galas, and team gatherings",
  },
  {
    title: "Private Parties",
    guests: "10–500 guests",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    description: "Intimate celebrations with personalized attention to detail",
  },
  {
    title: "Catering Services",
    guests: "Any scale",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80",
    description: "Full-service catering with customizable menus for every occasion",
  },
];

export function EventCategories() {
  return (
    <section id="events" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Events We Craft
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we bring your vision to life
            with impeccable service and unforgettable food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-heading font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="text-white/80 text-sm">{event.guests}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-gold font-medium text-sm hover:text-gold-hover transition-colors"
                >
                  Explore <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
