"use client";
// ============================================================
// FITMEN COOK — Personalized Nutrition Dashboard
// ============================================================
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, BadgeCheck, Brain, ChevronDown, Clock, Droplets,
  Dumbbell, Flame, HeartPulse, Leaf, Refrigerator, ShieldCheck, Sparkles,
  Star, UtensilsCrossed, Wheat,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
  ALLERGY_OPTIONS, CONDITION_OPTIONS, MEALS, type Meal,
} from "@/lib/nutrition-data";

// ---- CONFIG --------------------------------------------------
const WHATSAPP_NUMBER = "919101128893";

// ---- Types ---------------------------------------------------
type Goal = "lose" | "maintain" | "gain";
type Pref = "veg" | "nonveg" | "vegan";

type Profile = {
  age: number; gender: "m" | "f"; h: number; w: number;
  act: number; goal: Goal; pref: Pref;
  allergies: string[]; conditions: string[];
};

type Plan = {
  bmr: number; cal: number; pro: number; carb: number; fat: number;
  fiber: number; waterL: number; bmi: number; bmiLabel: string;
  bmiPct: number; meals: string;
};

type Scored = {
  meal: Meal; match: number; proteinScore: number; nutritionScore: number;
  quality: number; healthScore: number; reasons: string[]; warnings: string[];
};

const GOAL_LABEL: Record<Goal, string> = { lose: "Weight Loss", maintain: "Maintenance", gain: "Muscle Gain" };
const GOAL_TAGS: Record<Goal, string[]> = {
  lose: ["Weight Loss", "Fat Loss", "Low Carb", "Diabetic Friendly"],
  maintain: ["Maintenance", "Heart Healthy", "Office Workers"],
  gain: ["Muscle Gain", "Lean Bulk", "High Protein", "Gym Athletes"],
};
const ALLERGY_LABEL: Record<string, string> = {
  seafood: "Seafood Allergy", dairy: "Lactose Intolerance", gluten: "Gluten Allergy",
  nuts: "Nut Allergy", egg: "Egg Allergy", soy: "Soy Allergy",
};

// ---- Engine --------------------------------------------------
const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

function computePlan(p: Profile): Plan {
  const bmr = Math.round(10 * p.w + 6.25 * p.h - 5 * p.age + (p.gender === "m" ? 5 : -161));
  let cal = bmr * p.act;
  if (p.goal === "lose") cal -= 400;
  if (p.goal === "gain") cal += 350;
  cal = Math.round(cal / 10) * 10;
  const pro = Math.round(p.w * (p.goal === "gain" ? 2 : p.goal === "lose" ? 1.8 : 1.5));
  const fat = Math.round((cal * 0.25) / 9);
  const carb = Math.round((cal - pro * 4 - fat * 9) / 4);
  const fiber = Math.round((cal / 1000) * 14);
  const waterL = +(p.w * 0.035 + (p.act >= 1.55 ? 0.5 : 0)).toFixed(1);
  const bmi = +(p.w / Math.pow(p.h / 100, 2)).toFixed(1);
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  const bmiPct = clamp(((bmi - 14) / (36 - 14)) * 100);
  const meals = p.goal === "gain" ? "4 meals + 2 snacks" : p.goal === "lose" ? "3 meals + 1 snack" : "3 meals + 2 snacks";
  return { bmr, cal, pro, carb, fat, fiber, waterL, bmi, bmiLabel, bmiPct, meals };
}

function scoreMeals(p: Profile, plan: Plan): Scored[] {
  const dietOk = (m: Meal) =>
    p.pref === "vegan" ? m.diet === "vegan"
    : p.pref === "veg" ? m.diet === "veg" || m.diet === "vegan"
    : true;

  return MEALS.filter(dietOk)
    .filter((m) => !m.allergens.some((a) => p.allergies.includes(a)))
    .map((m) => {
      const n = m.nutrition;
      const reasons: string[] = [];
      const warnings: string[] = [];
      let match = 52;

      const hits = m.bestFor.filter((t) => GOAL_TAGS[p.goal].includes(t)).length;
      match += hits * 9;
      if (hits) reasons.push(`Tagged for ${GOAL_TAGS[p.goal][0].toLowerCase()} by our chefs`);

      const proDensity = (n.protein * 4) / n.calories;
      if (p.goal === "gain" && proDensity > 0.3) { match += 10; reasons.push(`${n.protein}g protein per serving fuels muscle synthesis`); }
      if (p.goal === "lose") {
        if (n.calories <= plan.cal / 3) { match += 8; reasons.push(`${n.calories} kcal fits inside your ${plan.cal} kcal budget`); }
        if (n.fiber >= 7) { match += 6; reasons.push(`${n.fiber}g fiber keeps you full on fewer calories`); }
      }
      if (p.goal === "maintain" && n.calories >= 300 && n.calories <= 560) { match += 8; reasons.push("Balanced portion for maintenance calories"); }
      if (proDensity >= 0.25 && p.goal !== "gain") reasons.push("Protein-forward — protects lean muscle");

      if (p.conditions.includes("diabetes")) {
        if (n.sugar <= 8) { match += 5; reasons.push("Low sugar — steady glucose response"); }
        else { match -= 14; warnings.push(`${n.sugar}g sugar — watch glucose`); }
      }
      if (p.conditions.includes("hypertension") || p.conditions.includes("heart")) {
        if (n.sodium <= 450) { match += 5; reasons.push("Sodium-friendly for BP / heart"); }
        else { match -= 12; warnings.push(`${n.sodium}mg sodium — on the higher side`); }
        if (n.omega3 >= 1) { match += 6; reasons.push("Omega-3 rich — supports heart health"); }
      }
      if (p.conditions.includes("kidney")) {
        if (n.sodium > 500 || n.protein > 40) { match -= 18; warnings.push("High protein/sodium — check with your doctor"); }
      }

      const proteinScore = clamp(Math.round((proDensity / 0.4) * 100));
      const micros = [n.calcium >= 100, n.iron >= 2.5, n.potassium >= 500, n.vitA >= 100, n.vitC >= 30, n.vitD >= 0.3, n.vitB12 >= 0.5, n.magnesium >= 80, n.omega3 >= 0.3, n.fiber >= 6];
      const nutritionScore = clamp(Math.round((micros.filter(Boolean).length / micros.length) * 100) + 15);
      const healthScore = clamp(Math.round(
        (n.fiber >= 6 ? 28 : n.fiber * 4) + (n.sugar <= 8 ? 26 : 12) +
        (n.sodium <= 500 ? 26 : 12) + (n.cholesterol <= 90 ? 20 : 10)
      ));
      const quality = Math.round((m.rating / 5) * 100);
      match = clamp(Math.round(match + (quality - 88) * 0.2), 42, 99);

      return { meal: m, match, proteinScore, nutritionScore, quality, healthScore, reasons: reasons.slice(0, 3), warnings };
    })
    .sort((a, b) => b.match - a.match);
}

function coachMessage(p: Profile, plan: Plan, top: Scored | undefined): string {
  if (!top) return "No meals match your current filters — try relaxing an allergy or preference filter, or ping us on WhatsApp for a custom meal.";
  const m = top.meal, n = m.nutrition;
  const altGoal: Goal = p.goal === "gain" ? "lose" : "gain";
  const goalLine =
    p.goal === "gain"
      ? `you need a ${plan.cal} kcal surplus with ~${plan.pro}g protein daily, and its ${n.protein}g protein + ${n.calories} kcal per serving does the heavy lifting for one meal slot`
      : p.goal === "lose"
      ? `you're targeting ${plan.cal} kcal/day, and at ${n.calories} kcal with ${n.fiber}g fiber it fills you up while leaving room for ${plan.meals.toLowerCase()}`
      : `it sits right in your per-meal sweet spot (~${Math.round(plan.cal / 3)} kcal) with balanced macros for your ${plan.cal} kcal maintenance target`;
  return `Based on your ${GOAL_LABEL[p.goal].toLowerCase()} goal, ${m.name} is your #1 match (${top.match}%) — ${goalLine}. If your goal shifts to ${GOAL_LABEL[altGoal].toLowerCase()}, re-run the analysis: options like ${
    altGoal === "gain" ? "Chicken Keema Brown Rice or Whey Berry Smoothie Bowl" : "Sprouts Power Chaat or the Egg White Wrap"
  } would climb to the top instead.`;
}

// ---- Animated Score Ring -------------------------------------
function Ring({ value, label, size = 76, color = "#f5a50a", suffix = "" }: {
  value: number; label: string; size?: number; color?: string; suffix?: string;
}) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(value); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const r = (size - 10) / 2, C = 2 * Math.PI * r;
  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="7" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C - (C * v) / 100}
            className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none" />
        </svg>
        <b className="absolute inset-0 grid place-items-center font-mono text-sm" style={{ color }}>
          {Math.round(v)}{suffix}
        </b>
      </div>
      <span className="max-w-[86px] text-center text-[9px] font-extrabold uppercase leading-tight tracking-widest text-[#b8b09c]">{label}</span>
    </div>
  );
}

// ---- Small UI helpers ----------------------------------------
const fieldCls = "mt-1 w-full rounded-xl border border-[#47423a] bg-[#2e2b23] px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-amber-brand";
const labelCls = "text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]";

function Chip({ active, onClick, children, tone = "amber" }: {
  active: boolean; onClick: () => void; children: React.ReactNode; tone?: "amber" | "red";
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
        active
          ? tone === "red"
            ? "border-[#e2574c] bg-[#e2574c]/15 text-[#ff9a92]"
            : "border-amber-brand bg-amber-brand/15 text-amber-brand"
          : "border-[#47423a] bg-[#2e2b23] text-[#b8b09c] hover:border-[#6b6353]"
      }`}>
      {children}
    </button>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone: "good" | "warn" | "benefit" }) {
  const map = {
    good: "bg-leaf/10 text-leaf border-leaf/25",
    warn: "bg-[#e2574c]/10 text-[#e2574c] border-[#e2574c]/25",
    benefit: "bg-amber-brand/10 text-amber-deep border-amber-brand/25",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${map[tone]}`}>{children}</span>;
}

const NUTRIENT_ROWS: [string, keyof Meal["nutrition"], string][] = [
  ["Calories", "calories", "kcal"], ["Protein", "protein", "g"], ["Carbs", "carbs", "g"],
  ["Fat", "fat", "g"], ["Fiber", "fiber", "g"], ["Sugar", "sugar", "g"],
  ["Sodium", "sodium", "mg"], ["Cholesterol", "cholesterol", "mg"], ["Calcium", "calcium", "mg"],
  ["Iron", "iron", "mg"], ["Potassium", "potassium", "mg"], ["Vitamin A", "vitA", "mcg"],
  ["Vitamin C", "vitC", "mg"], ["Vitamin D", "vitD", "mcg"], ["Vitamin B12", "vitB12", "mcg"],
  ["Magnesium", "magnesium", "mg"], ["Omega-3", "omega3", "g"],
];

// ---- Meal Card -----------------------------------------------
function MealCard({ s, rank }: { s: Scored; rank: number }) {
  const [open, setOpen] = useState(rank === 0);
  const m = s.meal, n = m.nutrition;
  const spice = ["No spice", "Mild 🌶", "Medium 🌶🌶", "Hot 🌶🌶🌶"][m.spice];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi FITMEN COOK! I'd like to order: ${m.name} (₹${m.price}) — recommended by my Nutrition Dashboard (${s.match}% match).`
  )}`;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
      <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl text-4xl"
          style={{ background: `linear-gradient(135deg, ${m.tint}33, ${m.tint}14)` }}>
          {m.image
            ? <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover" />
            : <span aria-hidden>{m.emoji}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {rank === 0 && <span className="rounded-full bg-amber-brand px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink">Top pick</span>}
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">{m.category} · {m.diet === "nonveg" ? "Non-veg" : m.diet === "egg" ? "Egg" : m.diet === "vegan" ? "Vegan" : "Veg"}</span>
          </div>
          <h4 className="mt-0.5 truncate font-display text-xl text-white">{m.name}</h4>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#b8b09c]">
            <span className="inline-flex items-center gap-1"><Star size={12} className="fill-amber-brand text-amber-brand" /> {m.rating} ({m.reviewCount})</span>
            <span className="inline-flex items-center gap-1"><Clock size={12} /> {m.prepTime}</span>
            <span>{m.serving}</span>
            <span>{spice}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Ring value={s.match} label="Match" size={64} suffix="%" />
          <div className="text-right">
            <b className="block font-mono text-2xl text-amber-brand">₹{m.price}</b>
            <button onClick={() => setOpen(!open)}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#b8b09c] hover:text-white">
              {open ? "Hide details" : "Full details"}
              <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 divide-x divide-white/5 border-y border-white/10 bg-white/[0.03] text-center">
        {[["kcal", n.calories], ["Protein", `${n.protein}g`], ["Carbs", `${n.carbs}g`], ["Fat", `${n.fat}g`], ["Fiber", `${n.fiber}g`]].map(([l, v]) => (
          <div key={l as string} className="py-2.5">
            <b className="block font-mono text-sm text-white">{v}</b>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8f887a]">{l}</span>
          </div>
        ))}
      </div>

      {open && (
        <div className="space-y-6 p-5 sm:p-6">
          <div className="rounded-2xl border border-amber-brand/20 bg-amber-brand/[0.06] p-4">
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-brand"><Sparkles size={13} /> Why this meal for you</p>
            <ul className="mt-2 space-y-1.5 text-sm text-cream">
              {s.reasons.map((r) => <li key={r} className="flex gap-2"><BadgeCheck size={15} className="mt-0.5 shrink-0 text-leaf" />{r}</li>)}
              {s.warnings.map((w) => <li key={w} className="flex gap-2 text-[#ffb3ad]"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#e2574c]" />{w}</li>)}
            </ul>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:justify-around">
            <Ring value={s.proteinScore} label="Protein Score" />
            <Ring value={s.nutritionScore} label="Nutrition Score" color="#7fb544" />
            <Ring value={s.quality} label="Meal Quality" color="#2d8fc4" />
            <Ring value={s.healthScore} label="Health Score" color="#e2574c" />
            <Ring value={s.match} label="Goal Match" suffix="%" />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Complete nutrition · per serving</p>
            <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
              {NUTRIENT_ROWS.map(([l, k, u]) => (
                <div key={l} className="flex items-baseline justify-between bg-ink px-3.5 py-2.5">
                  <span className="text-[11px] font-bold text-[#b8b09c]">{l}</span>
                  <b className="font-mono text-sm text-white">{n[k]}<span className="ml-0.5 text-[10px] text-[#8f887a]">{u}</span></b>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-leaf"><ShieldCheck size={13} /> Best for</p>
              <div className="flex flex-wrap gap-1.5">{m.bestFor.map((t) => <Tag key={t} tone="good">✔ {t}</Tag>)}</div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#e2574c]"><AlertTriangle size={13} /> Avoid if</p>
              <div className="flex flex-wrap gap-1.5">
                {m.avoidIf.length ? m.avoidIf.map((t) => <Tag key={t} tone="warn">⚠ {t}</Tag>) : <span className="text-xs text-[#8f887a]">No common restrictions</span>}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-deep"><HeartPulse size={13} /> Health benefits</p>
              <div className="flex flex-wrap gap-1.5">{m.benefits.map((t) => <Tag key={t} tone="benefit">{t}</Tag>)}</div>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <p className="flex gap-2 text-cream"><UtensilsCrossed size={16} className="mt-0.5 shrink-0 text-amber-brand" /><span><b className="text-white">Ingredients:</b> {m.ingredients.join(", ")}</span></p>
            <p className="flex gap-2 text-cream"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#e2574c]" /><span><b className="text-white">Allergens:</b> {m.allergens.length ? m.allergens.map((a) => ALLERGY_LABEL[a]?.replace(" Allergy", "").replace(" Intolerance", "")).join(", ") : "None"}</span></p>
            <p className="flex gap-2 text-cream"><Clock size={16} className="mt-0.5 shrink-0 text-[#2d8fc4]" /><span><b className="text-white">Best time to eat:</b> {m.bestTime}</span></p>
            <p className="flex gap-2 text-cream"><Refrigerator size={16} className="mt-0.5 shrink-0 text-leaf" /><span><b className="text-white">Storage:</b> {m.storage}</span></p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Pair with</p>
              <p className="mt-1.5 text-sm text-cream">{m.pairWith.join(" · ")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Similar meals</p>
              <p className="mt-1.5 text-sm text-cream">
                {m.similar.map((id) => MEALS.find((x) => x.id === id)?.name).filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Customer reviews</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {m.reviews.map((r) => (
                <blockquote key={r.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="flex items-center gap-1 text-amber-brand">{"★".repeat(r.stars)}<span className="text-[#47423a]">{"★".repeat(5 - r.stars)}</span></p>
                  <p className="mt-1.5 text-sm text-cream">&ldquo;{r.text}&rdquo;</p>
                  <footer className="mt-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#8f887a]">— {r.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>

          <a href={wa} target="_blank" rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-brand px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-auto">
            🛒 Order now · ₹{m.price}
          </a>
        </div>
      )}
    </article>
  );
}

// ---- Main Dashboard ------------------------------------------
export function NutritionDashboard() {
  const { setTargets } = useStore();
  const [p, setP] = useState<Profile>({
    age: 25, gender: "m", h: 170, w: 70, act: 1.375, goal: "maintain",
    pref: "nonveg", allergies: [], conditions: [],
  });
  const [analyzed, setAnalyzed] = useState<{ p: Profile; plan: Plan } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggle = (key: "allergies" | "conditions", id: string) =>
    setP((prev) => ({ ...prev, [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id] }));

  const analyze = () => {
    const plan = computePlan(p);
    setAnalyzed({ p: { ...p, allergies: [...p.allergies], conditions: [...p.conditions] }, plan });
    setTargets({ kcal: plan.cal, protein: plan.pro });
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const scored = useMemo(() => (analyzed ? scoreMeals(analyzed.p, analyzed.plan) : []), [analyzed]);
  const coach = useMemo(() => (analyzed ? coachMessage(analyzed.p, analyzed.plan, scored[0]) : ""), [analyzed, scored]);

  return (
    <section className="mt-8 overflow-hidden rounded-3xl bg-ink text-cream">
      <div className="border-b border-white/10 p-7 sm:p-9">
        <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-brand">
          <Activity size={14} /> Personalized Nutrition Dashboard
        </p>
        <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">Your body. Your numbers. Your meals.</h3>
        <p className="mt-2 max-w-xl text-sm text-[#b8b09c]">
          Tell us about yourself once — we calculate your exact daily targets and match every meal on our menu against <em>your</em> body and goal.
        </p>
      </div>

      <div className="p-7 sm:p-9">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <label className={labelCls}>Age
            <input type="number" min={13} max={90} value={p.age} onChange={(e) => setP({ ...p, age: +e.target.value })} className={fieldCls} />
          </label>
          <label className={labelCls}>Gender
            <select value={p.gender} onChange={(e) => setP({ ...p, gender: e.target.value as "m" | "f" })} className={fieldCls}>
              <option value="m">Male</option><option value="f">Female</option>
            </select>
          </label>
          <label className={labelCls}>Height (cm)
            <input type="number" min={120} max={230} value={p.h} onChange={(e) => setP({ ...p, h: +e.target.value })} className={fieldCls} />
          </label>
          <label className={labelCls}>Weight (kg)
            <input type="number" min={30} max={220} value={p.w} onChange={(e) => setP({ ...p, w: +e.target.value })} className={fieldCls} />
          </label>
          <label className={labelCls}>Activity level
            <select value={p.act} onChange={(e) => setP({ ...p, act: +e.target.value })} className={fieldCls}>
              <option value={1.2}>Sedentary (desk job)</option>
              <option value={1.375}>Light (1–3 workouts/wk)</option>
              <option value={1.55}>Moderate (3–5 workouts/wk)</option>
              <option value={1.725}>Active (6–7 workouts/wk)</option>
            </select>
          </label>
          <label className={labelCls}>Goal
            <select value={p.goal} onChange={(e) => setP({ ...p, goal: e.target.value as Goal })} className={fieldCls}>
              <option value="lose">Weight Loss</option><option value="maintain">Maintenance</option><option value="gain">Muscle Gain</option>
            </select>
          </label>
          <label className={`${labelCls} col-span-2`}>Food preference
            <div className="mt-1 grid grid-cols-3 gap-2">
              {([["veg", "🟢 Veg"], ["nonveg", "🔴 Non-Veg"], ["vegan", "🌱 Vegan"]] as const).map(([v, l]) => (
                <button key={v} type="button" onClick={() => setP({ ...p, pref: v })} aria-pressed={p.pref === v}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold transition-colors ${
                    p.pref === v ? "border-amber-brand bg-amber-brand/15 text-amber-brand" : "border-[#47423a] bg-[#2e2b23] text-[#b8b09c]"
                  }`}>{l}</button>
              ))}
            </div>
          </label>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className={labelCls}>Allergies</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALLERGY_OPTIONS.map((a) => (
                <Chip key={a.id} tone="red" active={p.allergies.includes(a.id)} onClick={() => toggle("allergies", a.id)}>{a.label}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className={labelCls}>Medical conditions <span className="normal-case text-[#8f887a]">(optional)</span></p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CONDITION_OPTIONS.map((c) => (
                <Chip key={c.id} active={p.conditions.includes(c.id)} onClick={() => toggle("conditions", c.id)}>{c.label}</Chip>
              ))}
            </div>
          </div>
        </div>

        <button onClick={analyze}
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-amber-brand px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]">
          ⚡ Analyze my nutrition
        </button>
      </div>

      {analyzed && (
        <div ref={resultsRef} className="border-t border-white/10 p-7 sm:p-9">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Your daily targets</p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:justify-around sm:p-6">
            <Ring value={analyzed.plan.bmiPct} label={`BMI ${analyzed.plan.bmi} · ${analyzed.plan.bmiLabel}`} size={92}
              color={analyzed.plan.bmiLabel === "Healthy" ? "#7fb544" : "#f5a50a"} />
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
              {[
                [<Flame key="i" size={16} />, `${analyzed.plan.cal}`, "Calories / day", "text-amber-brand"],
                [<Dumbbell key="i" size={16} />, `${analyzed.plan.pro}g`, "Protein", "text-leaf"],
                [<Wheat key="i" size={16} />, `${analyzed.plan.carb}g`, "Carbs", "text-[#e0c36a]"],
                [<Leaf key="i" size={16} />, `${analyzed.plan.fat}g`, "Fat", "text-[#ff9a92]"],
                [<Leaf key="i" size={16} />, `${analyzed.plan.fiber}g`, "Fiber", "text-leaf"],
                [<Droplets key="i" size={16} />, `${analyzed.plan.waterL} L`, "Water / day", "text-[#2d8fc4]"],
                [<Activity key="i" size={16} />, `${analyzed.plan.bmr}`, "BMR (kcal)", "text-[#b8b09c]"],
                [<UtensilsCrossed key="i" size={16} />, analyzed.plan.meals, "Recommended meals", "text-amber-deep"],
              ].map(([icon, v, l, c]) => (
                <div key={l as string} className="rounded-2xl border border-white/10 bg-ink px-4 py-3">
                  <span className={`${c}`}>{icon}</span>
                  <b className={`mt-0.5 block font-mono text-lg leading-tight ${c}`}>{v}</b>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8f887a]">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-brand/25 bg-gradient-to-br from-amber-brand/[0.12] to-transparent p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-brand">
              <Brain size={14} /> AI Nutrition Coach
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream">{coach}</p>
          </div>

          <div className="mt-8 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8b09c]">Matched from our menu</p>
              <h4 className="font-display text-2xl text-white">Recommended for {GOAL_LABEL[analyzed.p.goal].toLowerCase()}</h4>
            </div>
            <span className="shrink-0 font-mono text-xs text-[#8f887a]">{scored.length} meals matched</span>
          </div>
          <div className="mt-4 space-y-4">
            {scored.map((s, i) => <MealCard key={s.meal.id} s={s} rank={i} />)}
            {!scored.length && (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-[#b8b09c]">
                No meals match these filters. Remove an allergy filter, or message us on WhatsApp — we&apos;ll customise one for you.
              </p>
            )}
          </div>

          <p className="mt-6 text-[11px] text-[#8f887a]">
            Estimates use the Mifflin-St Jeor equation and standard nutrition references. General guidance only, not medical or dietetic advice — consult a professional, especially if you selected a medical condition.
          </p>
        </div>
      )}
    </section>
  );
}