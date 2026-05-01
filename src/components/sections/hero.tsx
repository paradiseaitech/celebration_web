"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-sm sm:text-base font-medium tracking-widest uppercase mb-4">
            Premium Catering & Event Management
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Craft Your Perfect
            <span className="block text-gold-gradient">Celebration</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            End-to-end event management in Purnia, Bihar — serving across India.
            From intimate gatherings to grand celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#menu">
              <Button size="lg" className="bg-gold text-navy hover:bg-gold-hover px-10">
                Plan Your Event
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="px-10">
                Get a Quote
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-gold/60" />
      </motion.div>
    </section>
  );
}
