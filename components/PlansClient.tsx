"use client";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { wa, CONFIG } from "@/lib/config";

const PLANS = [
  {
    name: "Trial Day", price: "₹299", per: "/day", strike: "", flag: "",
    feats: ["1 full day — lunch + dinner", "Macro-labeled meal boxes", "Pick veg or non-veg", "Free delivery in Vizag"],
    msg: "Hi FIT MEN COOK! I'd like to book a ₹299 Trial Day (lunch + dinner). Please share today's menu 🍱",
    cta: "Try One Day", variant: "ghost" as const, hot: false,
  },
  {
    name: "Week Plan", price: "₹5,950", per: "/week", strike: "", flag: "MOST POPULAR",
    feats: ["Breakfast + lunch + dinner × 7 days", "South Indian & healthy rotating menu", "Choice of base — quinoa, brown rice, chapati", "Grilled chicken / paneer / eggs included", "Healthy salads, veggies & curd daily"],
    msg: "Hi FIT MEN COOK! I want to subscribe to the Week Plan (₹5,950). Please share this week's menu 📅",
    cta: "Start Week Plan", variant: "amber" as const, hot: true,
  },
  {
    name: "Premium Monthly", price: "₹20,999", per: "/month", strike: "₹21,997", flag: "SAVE ₹998",
    feats: ["Breakfast + lunch + dinner, every day", "Luxury millet-based, high-protein meals", "Daily juice + protein shake", "Custom diet plan for your goal", "Just ₹700/day for full premium"],
    msg: "Hi FIT MEN COOK! I'm interested in the Premium Monthly Plan (₹20,999). Please share details 👑",
    cta: "Go Premium", variant: "ghost" as const, hot: false,
  },
];

export function PlansClient() {
  return (
    <div className="mx-auto w-[min(1180px,94%)] py-12">
      <Reveal>
        <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
          <span className="h-0.5 w-7 bg-amber-brand" /> Subscription Plans
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">Eat right, all week long</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-fg">
          Skip the daily ordering. Subscribe once — we handle the cooking, macros and delivery. Pause or modify anytime on WhatsApp.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="h-full">
            <div className={`card-surface relative flex h-full flex-col rounded-3xl p-7 transition-transform hover:-translate-y-1.5 ${p.hot ? "border-[3px] border-fg shadow-2xl" : ""}`}
              style={p.hot ? { borderColor: "var(--fg)" } : undefined}>
              {p.flag && (
                <span className="absolute -top-3.5 right-5 rounded-lg bg-amber-brand px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-ink shadow">
                  {p.flag}
                </span>
              )}
              <h3 className="font-display text-2xl">{p.name}</h3>
              {p.strike && <span className="font-mono text-sm text-muted-fg line-through">{p.strike}</span>}
              <p className="font-mono text-4xl font-bold">{p.price}<small className="text-base text-muted-fg">{p.per}</small></p>
              <ul className="my-6 flex-1 space-y-2.5">
                {p.feats.map((f) => (
                  <li key={f} className="flex gap-2 text-sm font-semibold text-ink-soft dark:text-muted-fg">
                    <span className="text-leaf">✔</span>{f}
                  </li>
                ))}
              </ul>
              <a href={wa(p.msg)} target="_blank" rel="noopener noreferrer">
                <Button variant={p.variant} className="w-full">{p.cta}</Button>
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="card-surface mt-10 rounded-3xl p-7">
          <h3 className="font-display text-xl">Manage your subscription</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-fg">
            Pause for travel, swap veg/non-veg days, change delivery time, or upgrade plans — one message is all it takes.
            Payments accepted via UPI, cash on delivery, or bank transfer.
          </p>
          <a href={wa(`Hi ${CONFIG.brand}! I'd like to manage my subscription (pause / modify / upgrade).`)} target="_blank" rel="noopener noreferrer">
            <Button variant="wa" className="mt-4">💬 Manage on WhatsApp</Button>
          </a>
        </div>
      </Reveal>
    </div>
  );
}
