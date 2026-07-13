import { Reveal } from "@/components/Reveal";
import { Card, CardBody } from "@/components/ui/card";
import { CONFIG } from "@/lib/config";

export const metadata = { title: "About — FIT MEN COOK Vizag" };

export default function About() {
  return (
    <div className="mx-auto w-[min(1080px,94%)] py-12">
      <Reveal>
        <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
          <span className="h-0.5 w-7 bg-amber-brand" /> Our Story
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">Built in a Vizag kitchen,<br />for Vizag fitness goals</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="card-surface mt-8 grid gap-8 rounded-3xl p-8 md:grid-cols-[auto_1fr]">
          <div className="grid size-28 place-items-center rounded-3xl bg-gradient-to-br from-[#fdf1d8] to-[#f7d488] text-6xl dark:from-[#2c2618] dark:to-[#4a3a12]">👨‍🍳</div>
          <div>
            <h3 className="font-display text-2xl">The chef&apos;s story</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft dark:text-muted-fg">
              FIT MEN COOK started in Maddilapalem with a simple frustration: eating healthy in Vizag meant either bland
              boiled food or expensive restaurant &ldquo;diet menus&rdquo; with mystery macros. We believed South Indian food —
              pesarattu, ragi, millets, home-style dal — could fuel serious fitness goals without losing its soul.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft dark:text-muted-fg">
              Today every box we send out is cooked fresh the same morning, weighed, macro-labeled, and delivered across
              the city. No frozen stock, no reused oil, no shortcuts. Just consistent clean food that tastes like home.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ["🌾", "Ingredient sourcing", "Millets & vegetables from local Andhra farms; chicken and fish sourced fresh daily from trusted Vizag suppliers — never frozen inventory."],
          ["🧼", "Hygiene standards", "FSSAI-registered kitchen practices: sanitised prep zones, gloved handling, sealed food-grade packaging, daily deep cleaning."],
          ["⚖️", "Honest macros", "Every recipe is portioned by weight. The number on the label is the number in the box — that's the whole brand promise."],
        ].map(([ic, h, p], i) => (
          <Reveal key={h} delay={i * 0.08}>
            <Card className="h-full"><CardBody>
              <p className="text-3xl">{ic}</p>
              <h4 className="mt-3 font-extrabold">{h}</h4>
              <p className="mt-1.5 text-sm text-muted-fg">{p}</p>
            </CardBody></Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-8 overflow-hidden rounded-3xl border border-line">
          <iframe title="FIT MEN COOK location map" src={CONFIG.mapEmbed} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" className="h-80 w-full border-0" />
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-muted-fg">{CONFIG.address}</p>
      </Reveal>
    </div>
  );
}
