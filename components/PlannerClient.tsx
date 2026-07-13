"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { MEALS, getMeal } from "@/lib/meals";
import { useStore, type PlannerSlot } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { wa, CONFIG } from "@/lib/config";
import { rup, cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: PlannerSlot["slot"][] = ["breakfast", "lunch", "dinner"];

export function PlannerClient() {
  const { planner, setSlot, removeSlot, addToCart } = useStore();
  const [pick, setPick] = useState<{ day: number; slot: PlannerSlot["slot"] } | null>(null);

  const get = (d: number, s: PlannerSlot["slot"]) => {
    const p = planner.find((x) => x.day === d && x.slot === s);
    return p ? getMeal(p.mealId) : undefined;
  };
  const dayTotals = (d: number) =>
    SLOTS.reduce(
      (a, s) => { const m = get(d, s); return m ? { kcal: a.kcal + m.kcal, p: a.p + m.p, cost: a.cost + m.price } : a; },
      { kcal: 0, p: 0, cost: 0 }
    );
  const weekCost = DAYS.reduce((a, _, i) => a + dayTotals(i).cost, 0);

  const sendPlan = () => {
    const lines = DAYS.map((d, i) => {
      const meals = SLOTS.map((s) => { const m = get(i, s); return m ? `  ${s}: ${m.name}` : null; }).filter(Boolean);
      return meals.length ? `*${d}*\n${meals.join("\n")}` : null;
    }).filter(Boolean);
    if (!lines.length) return;
    window.open(wa(`Hi ${CONFIG.brand}! Here's my weekly meal plan 📅\n\n${lines.join("\n")}\n\nEstimated total: ${rup(weekCost)}\nPlease confirm availability & delivery slots.`), "_blank", "noopener");
  };
  const addWeekToCart = () => {
    planner.forEach((p) => addToCart({ mealId: p.mealId, qty: 1 }));
  };

  return (
    <div className="mx-auto w-[min(1180px,94%)] py-12">
      <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
        <span className="h-0.5 w-7 bg-amber-brand" /> Weekly Meal Planner
      </p>
      <h1 className="font-display text-4xl sm:text-5xl">Plan the week. Win the week.</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-fg">
        Tap any slot to assign a meal. Totals per day update live — send the whole plan to us on WhatsApp when you&apos;re happy.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DAYS.map((d, di) => {
          const t = dayTotals(di);
          return (
            <div key={d} className="card-surface rounded-3xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg">{d}</h3>
                {t.kcal > 0 && (
                  <span className="font-mono text-[11px] font-bold text-muted-fg">
                    <b className="text-chili">{t.kcal}</b> kcal · <b className="text-leaf">{t.p}g</b> P
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {SLOTS.map((s) => {
                  const m = get(di, s);
                  return (
                    <div key={s}>
                      <p className="mb-1 text-[9px] font-extrabold uppercase tracking-widest text-muted-fg">{s}</p>
                      {m ? (
                        <div className="flex items-center gap-2 rounded-xl border border-line p-2">
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg text-lg" style={{ background: m.bg }}>{m.img}</span>
                          <span className="min-w-0 flex-1 truncate text-xs font-bold">{m.name}</span>
                          <button onClick={() => removeSlot(di, s)} aria-label="Remove" className="text-muted-fg hover:text-chili cursor-pointer"><X size={13} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setPick({ day: di, slot: s })}
                          className="w-full cursor-pointer rounded-xl border-2 border-dashed border-line py-2.5 text-xs font-bold text-muted-fg hover:border-amber-brand hover:text-amber-deep">
                          + Add meal
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {weekCost > 0 && (
        <div className="card-surface mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
          <p className="font-mono text-sm">Week total: <b className="text-lg">{rup(weekCost)}</b></p>
          <div className="flex gap-3">
            <Button variant="soft" onClick={addWeekToCart}>🛒 Add all to cart</Button>
            <Button variant="wa" onClick={sendPlan}>📲 Send plan on WhatsApp</Button>
          </div>
        </div>
      )}

      <Sheet open={!!pick} onClose={() => setPick(null)} title={pick ? `Pick ${pick.slot} · ${DAYS[pick.day]}` : ""} side="bottom">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MEALS.filter((m) => !pick || m.cat.includes(pick.slot) || pick.slot === "dinner" && m.cat.includes("lunch")).map((m) => (
            <button key={m.id}
              onClick={() => { if (pick) { setSlot({ ...pick, mealId: m.id }); setPick(null); } }}
              className={cn("card-surface flex cursor-pointer items-center gap-3 rounded-2xl p-3 text-left hover:border-amber-brand")}>
              <span className="grid size-12 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: m.bg }}>{m.img}</span>
              <span className="min-w-0">
                <b className="block truncate text-sm">{m.name}</b>
                <span className="font-mono text-xs text-muted-fg">{m.kcal} kcal · {m.p}g P · {rup(m.price)}</span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
