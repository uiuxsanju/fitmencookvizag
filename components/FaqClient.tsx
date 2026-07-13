"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { wa, CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";

const FAQS = [
  ["Which areas do you deliver to?", "We deliver free across Visakhapatnam — Maddilapalem, MVP Colony, Seethammadhara, Dwaraka Nagar, Madhurawada, Rushikonda and more. Use the PIN checker in the cart to confirm your zone and estimated time."],
  ["How do I order?", "Add meals to the cart and tap Checkout — it opens WhatsApp with your full order pre-filled. Confirm your address and delivery slot with us, and you're done."],
  ["Are the nutrition numbers accurate?", "Every recipe is portioned by weight against a fixed recipe card. Values are approximate per serving and can vary slightly with fresh daily cooking, but the macros on the label are what we cook to."],
  ["Can I customise meals?", "Yes — most rice bowls let you swap the base (white rice, brown rice, quinoa, millet), and you can set spice level per meal. For allergies, use the allergen filters in the menu and mention it in your WhatsApp order."],
  ["When should I order for next-day delivery?", "Order before 9 PM for next-day meal prep. Same-day orders are possible for select meals — WhatsApp us to check."],
  ["How is food packed and how long does it keep?", "Sealed, food-grade, portion-labeled boxes. Refrigerate on arrival and consume within 24 hours for best taste and safety. Reheat 60–90 seconds."],
  ["How do payments work?", "UPI on delivery, cash on delivery, or bank transfer for subscriptions. An online payment gateway is coming soon."],
  ["Can I pause my weekly / monthly plan?", "Absolutely — message us on WhatsApp a day before and we'll pause, swap days, or adjust your plan. No questions asked."],
];

export function FaqClient() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto w-[min(820px,94%)] py-12">
      <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
        <span className="h-0.5 w-7 bg-amber-brand" /> FAQ
      </p>
      <h1 className="font-display text-4xl sm:text-5xl">Questions? Answered.</h1>

      <div className="mt-8 space-y-3">
        {FAQS.map(([q, a], i) => (
          <div key={q} className="card-surface overflow-hidden rounded-2xl">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-extrabold"
              aria-expanded={open === i}>
              <span className="text-[15px]">{q}</span>
              <ChevronDown size={18} className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft dark:text-muted-fg">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="card-surface mt-8 rounded-3xl p-6 text-center">
        <p className="font-extrabold">Still have a question?</p>
        <a href={wa(`Hi ${CONFIG.brand}! I have a question:`)} target="_blank" rel="noopener noreferrer">
          <Button variant="wa" className="mt-3">💬 Ask on WhatsApp</Button>
        </a>
      </div>
    </div>
  );
}
