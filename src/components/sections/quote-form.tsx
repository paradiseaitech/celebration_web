"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENT_TYPES } from "@/lib/constants";
import { CheckCircle, AlertCircle } from "lucide-react";

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  eventType: z.string().min(1, "Please select an event type"),
  guestCount: z.string().min(1, "Please enter guest count"),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Get Started
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Let's Plan Your Celebration
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill in the details and we'll get back to you within 24 hours with a
            customized quote.
          </p>
        </div>

        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">Thank you!</p>
              <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Something went wrong</p>
              <p className="text-red-700 text-sm">Please try again or call us directly.</p>
            </div>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name *"
              id="name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Phone Number *"
              id="phone"
              placeholder="+91 XXXXX XXXXX"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="eventType" className="block text-sm font-medium text-charcoal">
                Event Type *
              </label>
              <select
                id="eventType"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white ${
                  errors.eventType ? "border-red-500" : "border-gray-200"
                }`}
                {...register("eventType")}
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-sm text-red-500">{errors.eventType.message}</p>
              )}
            </div>

            <Input
              label="Estimated Guest Count *"
              id="guestCount"
              type="number"
              placeholder="e.g., 200"
              error={errors.guestCount?.message}
              {...register("guestCount")}
            />
          </div>

          <Input
            label="Preferred Date"
            id="preferredDate"
            type="date"
            {...register("preferredDate")}
          />

          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm font-medium text-charcoal">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none placeholder:text-gray-400"
              placeholder="Tell us about your event, special requirements, or any questions..."
              {...register("message")}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gold text-navy hover:bg-gold-hover text-lg py-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}
