"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, CalendarDays, Activity, CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", l: "Home", I: Home },
  { href: "/menu", l: "Menu", I: UtensilsCrossed },
  { href: "/planner", l: "Planner", I: CalendarDays },
  { href: "/tracker", l: "Tracker", I: Activity },
  { href: "/about", l: "About", I: CircleUser },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[70] border-t border-line bg-page/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-5">
        {items.map(({ href, l, I }) => {
          const on = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn("flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-extrabold",
                on ? "text-amber-deep" : "text-muted-fg")}>
              <I size={19} strokeWidth={on ? 2.6 : 2} />
              {l}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
