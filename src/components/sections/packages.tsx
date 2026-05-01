"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const packages = [
  {
    name: "Silver",
    price: 350,
    features: [
      "3 Starters",
      "4 Main Course",
      "2 Desserts",
      "2 Beverages",
      "Basic Table Setup",
    ],
    popular: false,
  },
  {
    name: "Gold",
    price: 550,
    features: [
      "5 Starters",
      "6 Main Course",
      "4 Desserts",
      "3 Beverages",
      "Premium Table Setup",
      "Dedicated Coordinator",
    ],
    popular: true,
  },
  {
    name: "Platinum",
    price: 850,
    features: [
      "8 Starters",
      "8 Main Course",
      "6 Desserts",
      "4 Beverages",
      "Live Counters",
      "Premium Bar Setup",
      "Event Decoration",
      "VIP Service Staff",
    ],
    popular: false,
  },
];

export function Packages() {
  const handleSelect = (pkgName: string, pkgPrice: number) => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    const nameInput = document.getElementById("package-name") as HTMLInputElement;
    const messageInput = document.getElementById("message") as HTMLTextAreaElement;
    if (nameInput) nameInput.value = pkgName;
    if (messageInput) messageInput.value = `I'm interested in the ${pkgName} package (₹${pkgPrice}/plate). Please share more details.`;
  };

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Pre-Built Menus
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Curated Packages
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our carefully crafted packages, each designed to deliver
            an unforgettable culinary experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative bg-white rounded-xl p-8 ${
                pkg.popular
                  ? "border-2 border-gold shadow-xl luxury-shadow scale-105"
                  : "border border-gray-200 shadow-md"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-navy px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" /> Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-heading text-2xl font-bold text-navy mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gold">₹{pkg.price}</span>
                  <span className="text-gray-500 text-sm">/plate</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelect(pkg.name, pkg.price)}
                className={`w-full ${
                  pkg.popular
                    ? "bg-gold text-navy hover:bg-gold-hover"
                    : "bg-navy text-white hover:bg-navy-light"
                }`}
              >
                Select {pkg.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
