"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { wa, CONFIG } from "@/lib/config";

const stats = [
  { v: "30g+", l: "Protein / Meal", c: "text-leaf" },
  { v: "450–550", l: "Calories", c: "text-chili" },
  { v: "100%", l: "Clean Ingredients", c: "text-leaf" },
  { v: "₹79", l: "Meals From", c: "text-chili" },
];

export function Hero() {
  const lang = useStore((s) => s.lang);
  return (
    <section className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-amber-brand/15 blur-3xl" />
      <div className="mx-auto grid w-[min(1180px,94%)] items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <motion.p initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
            className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
            <span className="h-0.5 w-7 bg-amber-brand" /> Healthy Meal Prep · {CONFIG.city}
          </motion.p>
          <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            {[t("hero_1", lang), t("hero_2", lang)].map((line, i) => (
              <motion.span key={line} className="block"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                {line}
              </motion.span>
            ))}
            <motion.span className="block text-amber-brand"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              {t("hero_3", lang)}
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-5 max-w-xl text-[1.05rem] font-medium text-ink-soft dark:text-muted-fg">
            {t("hero_sub", lang)}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-7 flex flex-wrap gap-3">
            <Link href="/menu"><Button size="lg">🍽 {t("explore_menu", lang)}</Button></Link>
            <a href={wa(`Hi ${CONFIG.brand}! I'd like to know more about your meal plans 💪`)} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="lg">💬 WhatsApp</Button>
            </a>
          </motion.div>
          <div className="mt-9 flex flex-wrap gap-3">
            {stats.map((s, i) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="card-surface flex-1 rounded-2xl px-4 py-3 text-center sm:text-left">
                <b className={`block font-mono text-lg ${s.c}`}>{s.v}</b>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-fg">{s.l}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, rotate: 4, y: 30 }} animate={{ opacity: 1, rotate: 1.5, y: 0 }}
          whileHover={{ rotate: 0 }} transition={{ type: "spring", damping: 18 }}
          className="relative mx-auto w-full max-w-sm rounded-3xl border-[3px] border-ink bg-surface p-5 shadow-2xl dark:border-cream">
          <span className="absolute -left-3 -top-3 rounded-xl bg-amber-brand px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest text-ink shadow-lg">
            TODAY&apos;S SPECIAL
          </span>
          <div className="grid place-items-center rounded-2xl border border-line bg-gradient-to-br from-[#fdf1d8] to-[#f7d488] py-6 text-6xl dark:from-[#2c2618] dark:to-[#4a3a12]">
            🍗🥦
          </div>
          <h4 className="font-display mt-4 text-lg">Grilled Chicken & Steamed Veggies</h4>
          <p className="text-xs font-semibold text-muted-fg">with fresh lime · meal-prep friendly</p>
          <div className="macro-strip mt-3 flex">
            {[["430", "kcal", "text-chili"], ["38g", "protein", "text-leaf"], ["28g", "carbs", ""], ["16g", "fats", ""]].map(([v, l, c]) => (
              <div key={l} className="flex-1 py-2 text-center">
                <b className={`block font-mono ${c}`}>{v}</b>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-fg">{l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
