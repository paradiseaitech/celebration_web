"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePlateStore } from "@/store/plateStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const SERVICE_CATEGORIES = [
  { key: "food", label: "Food & Catering", icon: "🍽️", defaultPercent: 35 },
  { key: "venue", label: "Venue & Decor", icon: "🏛️", defaultPercent: 25 },
  { key: "photography", label: "Photography & Video", icon: "📸", defaultPercent: 10 },
  { key: "music", label: "Music & Entertainment", icon: "🎵", defaultPercent: 8 },
  { key: "makeup", label: "Makeup & Styling", icon: "💄", defaultPercent: 5 },
  { key: "transport", label: "Transport & Logistics", icon: "🚗", defaultPercent: 7 },
  { key: "misc", label: "Miscellaneous", icon: "📦", defaultPercent: 10 },
];

export function BudgetEstimator() {
  const [totalBudget, setTotalBudget] = useState("500000");
  const [breakdowns, setBreakdowns] = useState(
    SERVICE_CATEGORIES.map((cat) => ({
      key: cat.key,
      percent: cat.defaultPercent,
    }))
  );
  const [expanded, setExpanded] = useState(false);

  const totalPercent = breakdowns.reduce((sum, b) => sum + b.percent, 0);
  const total = parseInt(totalBudget) || 0;
  const foodCost = usePlateStore.getState().perPlateTotal() * usePlateStore.getState().guestCount;

  const updatePercent = (key: string, percent: number) => {
    setBreakdowns((prev) =>
      prev.map((b) => (b.key === key ? { ...b, percent } : b))
    );
  };

  return (
    <section id="budget" className="py-24 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Planning Tool
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Budget Estimator
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Get a clear breakdown of your event budget across all categories.
          </p>
        </div>

        <div className="bg-navy-light rounded-2xl p-6 sm:p-8 border border-white/10">
          <div className="mb-8">
            <label className="block text-white/60 text-sm mb-2">Total Budget (₹)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full bg-navy border border-white/20 text-white text-2xl font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
              min={0}
              step={10000}
            />
          </div>

          {foodCost > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gold/10 rounded-xl border border-gold/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gold font-semibold">Food from Plate Builder</p>
                  <p className="text-white/50 text-sm">
                    {usePlateStore.getState().itemCount()} items × {usePlateStore.getState().guestCount} guests
                  </p>
                </div>
                <span className="text-gold font-bold text-xl">₹{foodCost.toLocaleString()}</span>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {breakdowns.map((item) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.key === item.key);
              const amount = Math.round((total * item.percent) / 100);
              return (
                <div key={item.key} className="flex items-center gap-4">
                  <span className="text-2xl w-8">{cat?.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{cat?.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gold font-semibold">₹{amount.toLocaleString()}</span>
                        <span className="text-white/40 text-sm w-12 text-right">{item.percent}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-navy rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.percent}
                    onChange={(e) => updatePercent(item.key, parseInt(e.target.value) || 0)}
                    className="w-16 bg-navy border border-white/20 text-white text-sm rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              );
            })}
          </div>

          <div
            className={`mt-4 pt-4 border-t border-white/10 flex items-center justify-between ${
              totalPercent !== 100 ? "text-red-400" : "text-green-400"
            }`}
          >
            <span className="text-sm font-medium">
              {totalPercent === 100 ? (
                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Budget allocated</span>
              ) : (
                `${totalPercent > 100 ? "Over" : "Remaining"}: ${Math.abs(100 - totalPercent)}%`
              )}
            </span>
            <span className="font-bold">
              ₹{Math.round((total * totalPercent) / 100).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#contact">
            <Button className="bg-gold text-navy hover:bg-gold-hover">
              Get Detailed Quote
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
