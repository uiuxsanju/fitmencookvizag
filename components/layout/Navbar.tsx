"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun, ShoppingCart, Menu as MenuIcon, X, Languages, Heart } from "lucide-react";
import { useStore, useCartCount } from "@/lib/store";
import { t } from "@/lib/i18n";
import { CartSheet } from "@/components/cart/CartSheet";
import { CONFIG } from "@/lib/config";

export function Navbar() {
  const { dark, toggleDark, lang, setLang, wishlist } = useStore();
  const count = useCartCount();
  const [cartOpen, setCartOpen] = useState(false);
  const [mob, setMob] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const links = [
    { href: "/menu", l: t("nav_menu", lang) },
    { href: "/planner", l: t("nav_planner", lang) },
    { href: "/tracker", l: t("nav_tracker", lang) },
    { href: "/plans", l: t("nav_plans", lang) },
    { href: "/about", l: t("nav_about", lang) },
  ];

  return (
    <>
      <div className="bg-ink py-1.5 text-center text-xs font-bold tracking-wide text-cream">
        🚚 {t("free_delivery", lang)} · <span className="text-amber-brand">{CONFIG.phoneDisplay}</span>
      </div>
      <header className="sticky top-0 z-[60] border-b border-line bg-page/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-[min(1180px,94%)] items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Fit Men Cook home">
            <span className="text-xl">👨‍🍳</span>
            <span>
              <span className="font-display text-xl leading-none">
                FIT<span className="text-amber-brand">MEN</span>
                <span className="mx-0.5 text-ink-soft dark:text-muted-fg">⨯</span>COOK
              </span>
              <span className="hidden font-mono text-[8px] tracking-[0.3em] text-muted-fg sm:block">
                COOK HEALTHY · EAT BETTER · LIVE BETTER
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">
            {links.map((x) => (
              <Link key={x.href} href={x.href} className="transition-colors hover:text-amber-deep">
                {x.l}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "te" : "en")} aria-label="Switch language"
              className="hidden items-center gap-1 rounded-xl border border-line px-2.5 py-2 text-xs font-extrabold sm:flex cursor-pointer hover:border-amber-brand">
              <Languages size={14} /> {lang === "en" ? "తె" : "EN"}
            </button>
            <button onClick={toggleDark} aria-label="Toggle theme"
              className="grid size-10 place-items-center rounded-xl border border-line cursor-pointer hover:border-amber-brand">
              {mounted && dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link href="/menu?wish=1" aria-label="Wishlist"
              className="relative hidden size-10 place-items-center rounded-xl border border-line sm:grid hover:border-amber-brand">
              <Heart size={16} />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-chili text-[9px] font-bold text-white">{wishlist.length}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label="Open cart"
              className="relative grid size-10 place-items-center rounded-xl bg-ink text-cream cursor-pointer hover:opacity-90 dark:bg-amber-brand dark:text-ink">
              <ShoppingCart size={16} />
              {mounted && count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-chili px-1 text-[10px] font-bold text-white">{count}</span>
              )}
            </button>
            <button onClick={() => setMob(!mob)} aria-label="Menu"
              className="grid size-10 place-items-center rounded-xl border border-line lg:hidden cursor-pointer">
              {mob ? <X size={17} /> : <MenuIcon size={17} />}
            </button>
          </div>
        </div>
        {mob && (
          <nav className="border-t border-line bg-page px-[4%] py-4 lg:hidden">
            {links.map((x) => (
              <Link key={x.href} href={x.href} onClick={() => setMob(false)}
                className="block py-2.5 text-sm font-bold">{x.l}</Link>
            ))}
            <button onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="mt-2 flex items-center gap-2 py-2 text-sm font-bold cursor-pointer">
              <Languages size={15} /> {lang === "en" ? "తెలుగు" : "English"}
            </button>
          </nav>
        )}
      </header>
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
