"use client";
// ============================================================
// FITMEN COOK — Protein Calculator + Delivery Zones +
// Personalized Nutrition Dashboard
// ============================================================
import { useMemo, useState } from "react";
import { Bike, Clock, Dumbbell, MapPin } from "lucide-react";
import { NutritionDashboard } from "@/components/NutritionDashboard";
import { MEALS, type Meal } from "@/lib/nutrition-data";

const WHATSAPP_NUMBER = "919101128893";

// ============ DELIVERY CONFIG — edit areas/timings here ============
const DELIVERY_ZONES = [
  {
    zone: "Zone 1 · Free delivery",
    fee: 0,
    eta: "20–30 min",
    areas: ["Maddilapalem", "Dwaraka Nagar", "Siripuram", "RTC Complex", "Asilmetta", "Resapuvanipalem"],
  },
  {
    zone: "Zone 2 · ₹20",
    fee: 20,
    eta: "30–45 min",
    areas: ["MVP Colony", "Seethammadhara", "Beach Road", "Lawsons Bay", "Akkayyapalem", "Kancharapalem"],
  },
  {
    zone: "Zone 3 · ₹40",
    fee: 40,
    eta: "45–60 min",
    areas: ["Madhurawada", "PM Palem", "Gajuwaka", "NAD Junction", "Pendurthi", "Kommadi"],
  },
];

const DELIVERY_SLOTS = [
  { icon: "🌅", label: "Breakfast", time: "7:30 – 9:00 AM", cutoff: "Order by 10 PM (prev. day)" },
  { icon: "☀️", label: "Lunch", time: "12:00 – 1:30 PM", cutoff: "Order by 10:30 AM" },
  { icon: "🕓", label: "Snack", time: "4:30 – 5:30 PM", cutoff: "Order by 3:00 PM" },
  { icon: "🌙", label: "Dinner", time: "7:30 – 9:00 PM", cutoff: "Order by 6:00 PM" },
];
// ===================================================================

type Pref = "all" | "veg" | "vegan";

// ============ Protein Calculator (hero) ============
function ProteinWidget() {
  const [w, setW] = useState(70);
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("gain");
  const [pref, setPref] = useState<Pref>("all");
  const grams = Math.round(w * (goal === "gain" ? 2 : goal === "lose" ? 1.8 : 1.5));

  // greedy pick: highest-protein meals (matching diet pref) until target covered
  const picks = useMemo(() => {
    const ok = (m: Meal) =>
      pref === "vegan" ? m.diet === "vegan"
      : pref === "veg" ? m.diet === "veg" || m.diet === "vegan"
      : true;
    const sorted = MEALS.filter(ok).sort((a, b) => b.nutrition.protein - a.nutrition.protein);
    const out: Meal[] = [];
    let sum = 0;
    for (const m of sorted) {
      if (sum >= grams) break;
      out.push(m);
      sum += m.nutrition.protein;
      if (out.length === 5) break;
    }
    return { out, sum };
  }, [grams, pref]);

  return (
    <section className="grid gap-8 rounded-3xl border border-line bg-white/2 p-6 sm:p-8 lg:grid-cols-2">
      <div>
        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-fg">
          Your weight: <b className="font-mono text-base text-amber-deep">{w} kg</b>
          <input type="range" min={40} max={140} value={w} onChange={(e) => setW(+e.target.value)}
            className="mt-2 w-full accent-amber-brand" />
        </label>

        <p className="mt-5 text-[10px] font-extrabold uppercase tracking-widest text-muted-fg">Goal</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {([["lose", "Fat Loss"], ["maintain", "Maintain"], ["gain", "Muscle Gain"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setGoal(v)} aria-pressed={goal === v}
              className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold transition-colors ${
                goal === v ? "border-amber-brand bg-amber-brand/15 text-amber-deep" : "border-line text-muted-fg hover:border-amber-brand/50"
              }`}>{l}</button>
          ))}
        </div>

        <p className="mt-5 text-[10px] font-extrabold uppercase tracking-widest text-muted-fg">Food preference</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {([["all", "🔴 Non-Veg"], ["veg", "🟢 Veg"], ["vegan", "🌱 Vegan"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setPref(v)} aria-pressed={pref === v}
              className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold transition-colors ${
                pref === v ? "border-amber-brand bg-amber-brand/15 text-amber-deep" : "border-line text-muted-fg hover:border-amber-brand/50"
              }`}>{l}</button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-ink p-5 text-center text-cream">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Your daily protein target</span>
          <b className="mt-1 block font-mono text-5xl text-amber-brand">{grams}g</b>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-fg">Hit it with our kitchen 👇</p>
        <div className="mt-3 space-y-3">
          {picks.out.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl text-2xl"
                style={{ background: `linear-gradient(135deg, ${m.tint}33, ${m.tint}14)` }}>
                <span aria-hidden>{m.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <b className="block truncate text-sm">{m.name}</b>
                <span className="font-mono text-xs text-muted-fg">{m.nutrition.calories} kcal · ₹{m.price}</span>
              </div>
              <b className="shrink-0 font-mono text-leaf">{m.nutrition.protein}g</b>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-fg">
          These {picks.out.length} meals = <b className="text-leaf">{picks.sum}g protein</b> — {picks.sum >= grams ? "target smashed ✅" : "almost there, add a whey shake 💪"}
        </p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Hi FITMEN COOK! I need ${grams}g protein/day (${pref === "all" ? "non-veg" : pref}) — recommend me a plan.`
          )}`} target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-brand px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]">
          💬 Get my protein plan on WhatsApp
        </a>
      </div>
    </section>
  );
}

// ============ Delivery Zones & Timing ============
function DeliveryZones() {
  return (
    <section className="mt-10 rounded-3xl bg-ink p-6 text-cream sm:p-8">
      <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-brand">
        <Bike size={14} /> Delivery Zones &amp; Timing
      </p>
      <h2 className="mt-2 font-display text-3xl text-white">Fresh from Maddilapalem to your door.</h2>
      <p className="mt-2 max-w-xl text-sm text-[#b8b09c]">
        We cook and dispatch from our Maddilapalem kitchen. Check your area and delivery slot below.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {DELIVERY_ZONES.map((z) => (
          <div key={z.zone} className="rounded-2xl border border-white/10 bg-white/4 p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-brand">
              <MapPin size={13} /> {z.zone}
            </p>
            <p className="mt-1 font-mono text-xs text-[#8f887a]">ETA {z.eta}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {z.areas.map((a) => (
                <span key={a} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-cream">{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DELIVERY_SLOTS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/4 p-4 text-center">
            <span className="text-2xl" aria-hidden>{s.icon}</span>
            <b className="mt-1 block text-sm text-white">{s.label}</b>
            <p className="mt-0.5 flex items-center justify-center gap-1 font-mono text-xs text-amber-brand"><Clock size={11} /> {s.time}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#8f887a]">{s.cutoff}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-[#8f887a]">
        Area not listed? Ping us on WhatsApp — we&apos;re expanding across Vizag. Minimum order ₹149 · Free delivery on orders above ₹499.
      </p>
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi FITMEN COOK! Do you deliver to my area?")}`}
        target="_blank" rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-brand px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]">
        📍 Check my area on WhatsApp
      </a>
    </section>
  );
}

// ============ Page Client ============
export function TrackerClient() {
  return (
    <div className="mx-auto w-[min(1080px,94%)] py-12">
      <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
        <span className="h-0.5 w-7 bg-amber-brand" /> <Dumbbell size={13} className="inline" /> Protein Calculator
      </p>
      <h1 className="font-display text-4xl sm:text-5xl">How much protein do you actually need?</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-fg">
        Slide your weight, pick a goal and food preference — we show your daily number and exactly which meals hit it.
      </p>

      <div className="mt-6">
        <ProteinWidget />
      </div>

      {/* Delivery Zones & Timing */}
      <DeliveryZones />

      {/* Personalized Nutrition Dashboard */}
      <NutritionDashboard />
    </div>
  );
}