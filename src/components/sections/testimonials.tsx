"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Priya & Rahul Sharma",
    event: "Wedding, 800 guests",
    text: "Celebration.com made our wedding absolutely magical. The food was incredible and the team was so professional. Every guest complimented the menu.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    event: "Corporate Event, 200 guests",
    text: "We've used Celebration.com for three annual conferences now. Consistent quality, excellent service, and they always go the extra mile. Highly recommended.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    event: "Birthday Party, 50 guests",
    text: "The build-your-plate feature was amazing! Our guests loved customizing their meals. The team handled everything flawlessly. Will definitely book again.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    event: "Wedding Reception, 1200 guests",
    text: "Managing food for 1200 guests seemed impossible until we found Celebration.com. Their planning and execution was flawless. Truly premium service.",
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold fill-current" />
                ))}
              </div>

              <blockquote className="text-xl sm:text-2xl text-white/90 font-light leading-relaxed mb-8 italic">
                "{testimonials[current].text}"
              </blockquote>

              <div>
                <p className="text-gold font-semibold text-lg">
                  {testimonials[current].name}
                </p>
                <p className="text-white/50 text-sm">{testimonials[current].event}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-gold w-6" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
