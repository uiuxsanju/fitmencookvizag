import type { Meal } from "@/lib/meals";
export function MacroStrip({ m, compact }: { m: Meal; compact?: boolean }) {
  const cell = (v: string, l: string, cls = "") => (
    <div className="flex-1 py-1.5 text-center">
      <b className={`block font-mono ${compact ? "text-sm" : "text-base"} ${cls}`}>{v}</b>
      <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-fg">{l}</span>
    </div>
  );
  return (
    <div className="macro-strip flex">
      {cell(String(m.kcal), "kcal", "text-chili")}
      {cell(`${m.p}g`, "protein", "text-leaf")}
      {cell(`${m.c}g`, "carbs")}
      {cell(`${m.f}g`, "fat")}
    </div>
  );
}
