import Link from "next/link";
import { CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink pb-24 pt-14 text-[#cfc8b6] lg:pb-8">
      <div className="mx-auto w-[min(1180px,94%)]">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-white">
              FIT<span className="text-amber-brand">MEN</span>⨯COOK
            </p>
            <p className="mt-3 max-w-sm text-sm">
              Healthy meal prep & delivery in Visakhapatnam. Macro-labeled, high-protein,
              millet-based meals cooked fresh every day. Be consistent. Eat clean. Stay strong.
            </p>
          </div>
          <div>
            <h5 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-white">Explore</h5>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-amber-brand" href="/menu">Menu & Nutrition</Link></li>
              <li><Link className="hover:text-amber-brand" href="/planner">Weekly Planner</Link></li>
              <li><Link className="hover:text-amber-brand" href="/tracker">Progress Tracker</Link></li>
              <li><Link className="hover:text-amber-brand" href="/plans">Subscription Plans</Link></li>
              <li><Link className="hover:text-amber-brand" href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-white">Contact</h5>
            <ul className="space-y-2 text-sm">
              <li>{CONFIG.address}</li>
              <li><a className="hover:text-amber-brand" href={`tel:+${CONFIG.whatsapp}`}>{CONFIG.phoneDisplay}</a></li>
              <li><a className="hover:text-amber-brand" href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
              <li><a className="hover:text-amber-brand" href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">@fitmencook.vizag</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-5 text-xs text-[#8f887a]">
          <span>© {new Date().getFullYear()} <b className="text-amber-brand">FIT MEN COOK</b> · Visakhapatnam</span>
          <span>Nutrition values are approximate per serving.</span>
        </div>
      </div>
    </footer>
  );
}
