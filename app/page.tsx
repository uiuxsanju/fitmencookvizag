import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Reveal } from "@/components/Reveal";
import { MealCard } from "@/components/menu/MealCard";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { MEALS } from "@/lib/meals";
import { CONFIG } from "@/lib/config";

const REVIEWS = [
  { n: "Ravi K.", area: "MVP Colony", stars: 5, kg: "-8 kg in 3 months", txt: "Lunch box daily fix chesa — office lo colleagues andaru adugutunnaru ekkada nunchi ani. Taste + macros both on point." },
  { n: "Priya S.", area: "Seethammadhara", stars: 5, kg: "-5 kg in 6 weeks", txt: "Week plan changed my routine completely. No more deciding what to cook — just eat and train." },
  { n: "Arjun M.", area: "Madhurawada", stars: 4, kg: "+4 kg lean mass", txt: "Bulking on the premium plan. 30g+ protein every meal without me touching the kitchen. Worth it." },
];

const GALLERY = [
  { e: "🍱", t: "Meal-prep thali boxes", bg: "linear-gradient(135deg,#fde8cf,#f7c873)" },
  { e: "🐟", t: "Grilled fish & mash", bg: "linear-gradient(135deg,#dbeef7,#8fc7de)" },
  { e: "🥣", t: "Fruit & oats bowls", bg: "linear-gradient(135deg,#fdeccb,#f5c66b)" },
  { e: "🍗", t: "Tandoori grills", bg: "linear-gradient(135deg,#fcd9c9,#ef9a6f)" },
  { e: "🥗", t: "Rainbow salads", bg: "linear-gradient(135deg,#e9f4dc,#b8d98d)" },
  { e: "🍚", t: "Healthy biryani", bg: "linear-gradient(135deg,#fde5c0,#eda447)" },
];

export default function Home() {
  const trending = MEALS.filter((m) => m.trending).slice(0, 6);
  return (
    <>
      <Hero />
      <Marquee />

      {/* Trending */}
      <section className="mx-auto w-[min(1180px,94%)] py-16">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
                <span className="h-0.5 w-7 bg-amber-brand" /> Trending
              </p>
              <h2 className="font-display text-4xl">This week&apos;s most ordered</h2>
            </div>
            <Link href="/menu"><Button variant="ghost" size="sm">Full menu →</Button></Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((m, i) => <MealCard key={m.id} m={m} i={i} />)}
        </div>
      </section>

      {/* Transformations */}
      <section className="bg-ink py-16 text-cream">
        <div className="mx-auto w-[min(1180px,94%)]">
          <Reveal>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-brand">
              <span className="h-0.5 w-7 bg-amber-brand" /> Real Results
            </p>
            <h2 className="font-display text-4xl text-white">Customer transformations</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.n} delay={i * 0.1}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-brand">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                    <span className="rounded-full bg-leaf/20 px-3 py-1 font-mono text-xs font-bold text-[#8fd97f]">{r.kg}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#d8d1c0]">&ldquo;{r.txt}&rdquo;</p>
                  <p className="mt-4 text-sm font-extrabold text-white">{r.n} <span className="font-normal text-[#8f887a]">· {r.area}</span></p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery + Insta */}
      <section className="mx-auto w-[min(1180px,94%)] py-16">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
                <span className="h-0.5 w-7 bg-amber-brand" /> From Our Kitchen
              </p>
              <h2 className="font-display text-4xl">Real food gallery</h2>
            </div>
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">📸 @fitmencook.vizag</Button>
            </a>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {GALLERY.map((g, i) => (
            <Reveal key={g.t} delay={i * 0.06}>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-line">
                <div className="grid aspect-square place-items-center text-5xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: g.bg }}>{g.e}</div>
                <p className="card-surface border-0 border-t border-line p-2 text-center text-[11px] font-bold">{g.t}</p>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-fg">
          Follow us on Instagram for daily menus, cooking reels & transformation stories.
        </p>
      </section>

      {/* How it works */}
      <section className="mx-auto w-[min(1180px,94%)] pb-16">
        <Reveal><h2 className="font-display mb-8 text-4xl">From our kitchen to your goals</h2></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🥗", "Pick your meals", "Browse, filter by macros, and add to cart or your weekly planner."],
            ["🛒", "Checkout in seconds", "Smart cart with coupons → one tap sends the order on WhatsApp."],
            ["👨‍🍳", "Cooked fresh daily", "Home-cooked the same day with clean ingredients — never frozen."],
            ["🚚", "Delivered in Vizag", "Free delivery, sealed & portion-labeled. Check your PIN in cart."],
          ].map(([ic, h, p], i) => (
            <Reveal key={h} delay={i * 0.08}>
              <Card className="h-full">
                <CardBody>
                  <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-amber-deep">STEP 0{i + 1}</p>
                  <p className="my-3 text-3xl">{ic}</p>
                  <h4 className="font-extrabold">{h}</h4>
                  <p className="mt-1 text-sm text-muted-fg">{p}</p>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
