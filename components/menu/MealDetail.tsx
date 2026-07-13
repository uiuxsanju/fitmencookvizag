"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Heart } from "lucide-react";
import type { Meal } from "@/lib/meals";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rup, cn } from "@/lib/utils";

function Donut({ m }: { m: Meal }) {
  const pc = m.p * 4, cc = m.c * 4, fc = m.f * 9, tot = pc + cc + fc;
  const P = Math.round((pc / tot) * 100), C = Math.round((cc / tot) * 100), F = 100 - P - C;
  const CIRC = 2 * Math.PI * 60;
  const seg = (pct: number, off: number, col: string) => (
    <motion.circle cx="80" cy="80" r="60" fill="none" strokeWidth="20" stroke={col}
      initial={{ strokeDasharray: `0 ${CIRC}` }}
      whileInView={{ strokeDasharray: `${(pct / 100) * CIRC} ${CIRC}` }}
      viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
      strokeDashoffset={(-off / 100) * CIRC}
    />
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 160 160" className="size-44 -rotate-90" role="img"
        aria-label={`Macro split: protein ${P}%, carbs ${C}%, fat ${F}%`}>
        <circle cx="80" cy="80" r="60" fill="none" strokeWidth="20" className="stroke-line" />
        {seg(P, 0, "#3e7d32")}{seg(C, P, "#f5a50a")}{seg(F, P + C, "#c8502e")}
      </svg>
      <div className="flex flex-wrap justify-center gap-4 text-xs font-extrabold">
        <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-leaf" />Protein {P}%</span>
        <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-amber-brand" />Carbs {C}%</span>
        <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-chili" />Fat {F}%</span>
      </div>
    </div>
  );
}

export function MealDetail({ meal: m }: { meal: Meal }) {
  const { addToCart, wishlist, toggleWish, lang } = useStore();
  const [qty, setQty] = useState(1);
  const [base, setBase] = useState(m.bases?.[0]);
  const [spice, setSpice] = useState<number>(m.spice);
  const wished = wishlist.includes(m.id);

  const facts: [string, string][] = [
    ["Protein", `${m.p} g`], ["Total Carbohydrate", `${m.c} g`],
    ["  Dietary Fiber", `${m.fiber} g`], ["  Sugars", `${m.sugar} g`],
    ["Total Fat", `${m.f} g`], ["Sodium", `${m.sodium} mg`],
  ];

  return (
    <div className="mx-auto w-[min(1080px,94%)] py-10">
      <Link href="/menu" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-fg hover:text-amber-deep">
        <ArrowLeft size={16} /> Back to menu
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative grid h-72 place-items-center rounded-3xl text-8xl" style={{ background: m.bg }}>
            {m.img}
            <Badge className={`absolute left-4 top-4 bg-surface shadow ${m.veg ? "text-leaf" : "text-chili"}`}>
              {m.veg ? "🟢 Veg" : "🔴 Non-Veg"}
            </Badge>
            <button onClick={() => toggleWish(m.id)} aria-label="Wishlist"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-surface shadow cursor-pointer hover:scale-110 transition-transform">
              <Heart size={18} className={wished ? "fill-[#e0364b] text-[#e0364b]" : ""} />
            </button>
          </motion.div>

          <h1 className="font-display mt-6 text-3xl sm:text-4xl">{lang === "te" ? m.nameTe : m.name}</h1>
          <p className="mt-1 text-sm font-semibold text-muted-fg">
            {m.serving} · ⏱ {m.time} min · {"🌶".repeat(m.spice) || "mild"}
          </p>
          <p className="mt-3 text-[15px] text-ink-soft dark:text-muted-fg">{m.desc}</p>

          {/* customization */}
          {m.bases && (
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">Choose your base</p>
              <div className="flex flex-wrap gap-2">
                {m.bases.map((b) => (
                  <button key={b} onClick={() => setBase(b)}
                    className={cn("cursor-pointer rounded-full border-2 px-4 py-1.5 text-xs font-extrabold",
                      base === b ? "border-amber-brand bg-amber-brand/15 text-amber-deep" : "border-line")}>{b}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">Spice level</p>
            <div className="flex gap-2">
              {["No spice", "Mild 🌶", "Medium 🌶🌶", "Hot 🌶🌶🌶"].map((s, i) => (
                <button key={s} onClick={() => setSpice(i)}
                  className={cn("cursor-pointer rounded-full border-2 px-3 py-1.5 text-xs font-extrabold",
                    spice === i ? "border-chili bg-chili/10 text-chili" : "border-line")}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-line px-3 py-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="cursor-pointer"><Minus size={16} /></button>
              <b className="w-6 text-center font-mono text-lg">{qty}</b>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase" className="cursor-pointer"><Plus size={16} /></button>
            </div>
            <Button size="lg" className="flex-1 sm:flex-none"
              onClick={() => addToCart({ mealId: m.id, qty, base, note: `Spice: ${spice}` })}>
              🛒 Add to Cart — {rup(m.price * qty)}
            </Button>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div><h6 className="text-[11px] font-extrabold uppercase tracking-widest text-amber-deep">Ingredients</h6>
              <p className="mt-1 text-ink-soft dark:text-muted-fg">{m.ingredients}</p></div>
            <div><h6 className="text-[11px] font-extrabold uppercase tracking-widest text-amber-deep">Allergens</h6>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {(m.allergens.length ? m.allergens : ["None"]).map((a) => (
                  <span key={a} className="card-surface rounded-full px-3 py-1 text-xs font-bold">{a}</span>
                ))}
              </div></div>
            <div><h6 className="text-[11px] font-extrabold uppercase tracking-widest text-amber-deep">Storage & Prep</h6>
              <p className="mt-1 text-ink-soft dark:text-muted-fg">
                Cooked fresh on delivery day. Refrigerate on arrival; best within 24 hours. Reheat 60–90 seconds.</p></div>
          </div>
        </div>

        {/* nutrition column */}
        <div className="space-y-8">
          <div className="rounded-2xl border-[2.5px] border-fg p-5" style={{ borderColor: "var(--fg)" }}>
            <h5 className="font-display text-2xl">Nutrition Facts</h5>
            <p className="border-b-[10px] border-fg pb-2 pt-1 text-xs font-bold" style={{ borderColor: "var(--fg)" }}>
              Serving size: {m.serving}
            </p>
            <div className="flex justify-between border-b-4 border-fg py-2 text-lg font-extrabold" style={{ borderColor: "var(--fg)" }}>
              <span>Calories</span><span className="font-mono">{m.kcal}</span>
            </div>
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-1.5 text-sm">
                <span className={k.startsWith(" ") ? "pl-4" : "font-semibold"}>{k.trim()}</span>
                <span className="font-mono font-semibold">{v}</span>
              </div>
            ))}
            <p className="pt-3 text-[10px] leading-relaxed text-muted-fg">
              Values are approximate per serving and may vary slightly with daily fresh preparation.
            </p>
          </div>
          <Donut m={m} />
          <div>
            <h6 className="text-[11px] font-extrabold uppercase tracking-widest text-amber-deep">Health Benefits</h6>
            <ul className="mt-2 space-y-1.5 text-sm">
              {m.benefits.map((b) => <li key={b} className="flex gap-2"><span className="text-leaf">✔</span>{b}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
