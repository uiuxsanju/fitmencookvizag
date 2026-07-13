"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { MEALS, CATS, ALLERGENS } from "@/lib/meals";
import { MealCard } from "@/components/menu/MealCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MenuClient() {
  const params = useSearchParams();
  const wishOnly = params.get("wish") === "1";
  const { wishlist, targets } = useStore();

  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [cal, setCal] = useState(600);
  const [pro, setPro] = useState(0);
  const [price, setPrice] = useState(300);
  const [veg, setVeg] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [gf, setGf] = useState(false);
  const [noAllergen, setNoAllergen] = useState<string[]>([]);
  const [sort, setSort] = useState("pop");
  const [smart, setSmart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    let l = MEALS.filter(
      (m) =>
        (!wishOnly || wishlist.includes(m.id)) &&
        (cat === "all" || m.cat.includes(cat)) &&
        m.kcal <= cal && m.p >= pro && m.price <= price &&
        (!veg || m.veg) && (!vegan || m.vegan) && (!gf || m.glutenFree || !m.allergens.includes("Gluten")) &&
        noAllergen.every((a) => !m.allergens.includes(a)) &&
        (q === "" || (m.name + m.desc + m.ingredients).toLowerCase().includes(q.toLowerCase()))
    );
    if (smart && targets) {
      const per = targets.kcal / 3;
      l = [...l].sort(
        (a, b) =>
          Math.abs(a.kcal - per) / per - (a.p / targets.protein) * 0.9 -
          (Math.abs(b.kcal - per) / per - (b.p / targets.protein) * 0.9)
      );
    } else {
      l = [...l].sort((a, b) =>
        sort === "pro" ? b.p - a.p :
        sort === "calAsc" ? a.kcal - b.kcal :
        sort === "priceAsc" ? a.price - b.price :
        sort === "priceDesc" ? b.price - a.price : b.pop - a.pop
      );
    }
    return l;
  }, [cat, q, cal, pro, price, veg, vegan, gf, noAllergen, sort, wishOnly, wishlist, smart, targets]);

  return (
    <div className="mx-auto w-[min(1180px,94%)] py-12">
      <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
        <span className="h-0.5 w-7 bg-amber-brand" /> {wishOnly ? "Your Wishlist" : "Menu & Nutrition"}
      </p>
      <h1 className="font-display text-4xl sm:text-5xl">
        {wishOnly ? "Saved meals ❤️" : "Every meal. Every macro. Labeled."}
      </h1>

      {/* category chips */}
      <div className="mt-7 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c.k} onClick={() => setCat(c.k)}
            className={cn(
              "cursor-pointer rounded-full border-2 px-4 py-2 text-xs font-extrabold transition-colors",
              cat === c.k
                ? "border-ink bg-ink text-cream dark:border-amber-brand dark:bg-amber-brand dark:text-ink"
                : "border-line bg-surface hover:border-amber-brand"
            )}>
            {c.l}
          </button>
        ))}
      </div>

      {/* search + smart row */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg" />
          <Input className="pl-10" placeholder="Search chicken, dosa, biryani…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button variant={smart ? "amber" : "soft"} onClick={() => setSmart(!smart)} title={targets ? "" : "Set targets in Tracker first"}>
          <Sparkles size={15} /> AI Recommend {smart && targets ? "ON" : ""}
        </Button>
        <Button variant="soft" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={15} /> Filters
        </Button>
      </div>
      {smart && !targets && (
        <p className="mt-2 text-xs font-bold text-chili">Set your calorie/protein targets in the Tracker page first — then AI Recommend ranks meals for your goal.</p>
      )}
      {smart && targets && (
        <p className="mt-2 text-xs font-bold text-leaf">✨ Ranked for your goal: ~{Math.round(targets.kcal / 3)} kcal/meal, protein-first.</p>
      )}

      {/* advanced filters */}
      {showFilters && (
        <div className="card-surface mt-4 grid gap-5 rounded-3xl p-5 md:grid-cols-3">
          <div>
            <label className="flex justify-between text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">
              Max calories <output className="font-mono text-amber-deep">{cal}</output>
            </label>
            <input type="range" min={150} max={600} step={10} value={cal} onChange={(e) => setCal(+e.target.value)} className="w-full accent-amber-brand" />
            <label className="mt-3 flex justify-between text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">
              Min protein <output className="font-mono text-amber-deep">{pro}g</output>
            </label>
            <input type="range" min={0} max={40} value={pro} onChange={(e) => setPro(+e.target.value)} className="w-full accent-amber-brand" />
            <label className="mt-3 flex justify-between text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">
              Max price <output className="font-mono text-amber-deep">₹{price}</output>
            </label>
            <input type="range" min={79} max={300} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full accent-amber-brand" />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">Dietary preference</p>
            {[["🌱 Veg only", veg, setVeg], ["🌿 Vegan", vegan, setVegan], ["🌾 Gluten-free", gf, setGf]].map(([l, v, s]) => (
              <label key={l as string} className="mb-2 flex cursor-pointer items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={v as boolean} onChange={(e) => (s as (b: boolean) => void)(e.target.checked)} className="size-4 accent-leaf" />
                {l as string}
              </label>
            ))}
            <p className="mb-2 mt-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">Sort</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} disabled={smart}
              className="w-full rounded-xl border-2 border-line bg-surface px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-brand">
              <option value="pop">Popular</option>
              <option value="pro">Protein: High → Low</option>
              <option value="calAsc">Calories: Low → High</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
            </select>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-muted-fg">Exclude allergens</p>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((a) => (
                <button key={a}
                  onClick={() => setNoAllergen((x) => x.includes(a) ? x.filter((y) => y !== a) : [...x, a])}
                  className={cn("cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold",
                    noAllergen.includes(a) ? "border-chili bg-chili/10 text-chili line-through" : "border-line")}>
                  🚫 {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 font-mono text-xs text-muted-fg">
        SHOWING {list.length} OF {MEALS.length} MEALS
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((m, i) => <MealCard key={m.id} m={m} i={i} />)}
      </div>
      {list.length === 0 && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-line py-16 text-center font-semibold text-muted-fg">
          😕 No meals match — try relaxing filters.
        </div>
      )}
    </div>
  );
}
