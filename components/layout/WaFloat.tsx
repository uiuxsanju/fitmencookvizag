"use client";
import { wa, CONFIG } from "@/lib/config";
import { MessageCircle } from "lucide-react";

export function WaFloat() {
  return (
    <a
      href={wa(`Hi ${CONFIG.brand}! I'd like to place an order 🍽`)}
      target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-[80] grid size-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_26px_rgba(31,174,83,.45)] transition-transform hover:scale-110 lg:bottom-6"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  );
}
