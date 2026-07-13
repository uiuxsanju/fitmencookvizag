"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Flame, Clock } from "lucide-react";
import type { Meal } from "@/lib/meals";
import { useStore } from "@/lib/store";
import { MacroStrip } from "@/components/MacroStrip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rup } from "@/lib/utils";

export function MealCard({ m, i = 0 }: { m: Meal; i?: number }) {
  const { wishlist, toggleWish, addToCart, lang } = useStore();
  const wished = wishlist.includes(m.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 4) * 0.06 }}
      className="card-surface group flex flex-col overflow-hidden rounded-3xl transition-shadow hover:shadow-2xl"
    >
      <Link href={`/meal/${m.id}`} className="relative block">
        <div className="grid h-36 place-items-center text-5xl transition-transform duration-300 group-hover:scale-105"
          style={{ background: m.bg }}>
          {m.img}
        </div>
        <Badge className={`absolute left-3 top-3 bg-surface shadow ${m.veg ? "text-leaf" : "text-chili"}`}>
          {m.veg ? "🟢 Veg" : "🔴 Non-Veg"}
        </Badge>
        {m.trending && (
          <Badge className="absolute left-3 top-10 bg-ink text-amber-brand shadow"><Flame size={10} /> Trending</Badge>
        )}
      </Link>
      <button
        onClick={() => toggleWish(m.id)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-surface shadow transition-transform hover:scale-110 cursor-pointer"
      >
        <Heart size={15} className={wished ? "fill-[#e0364b] text-[#e0364b]" : "text-muted-fg"} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/meal/${m.id}`}>
          <h3 className="text-[15px] font-extrabold leading-snug hover:text-amber-deep">
            {lang === "te" ? m.nameTe : m.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-muted-fg">{m.desc}</p>
        <div className="mt-2 mb-2.5 flex gap-3 text-[10px] font-bold text-muted-fg">
          <span className="flex items-center gap-1"><Clock size={11} /> {m.time} min</span>
          <span>{"🌶".repeat(m.spice) || "mild"}</span>
          <span>{m.serving}</span>
        </div>
        <MacroStrip m={m} compact />
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <b className="font-mono text-lg">{rup(m.price)}</b>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-fg">per serving</span>
          </div>
          <Button size="sm" onClick={() => addToCart({ mealId: m.id, qty: 1 })}>+ Add</Button>
        </div>
      </div>
    </motion.article>
  );
}
