"use client";

import { COMPANY } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = COMPANY.whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent("Hi! I'm interested in your catering services. Can you help me plan my event?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
