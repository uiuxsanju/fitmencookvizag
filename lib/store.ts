"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "./i18n";

export type CartItem = { mealId: number; qty: number; base?: string; note?: string };
export type PlannerSlot = { day: number; slot: "breakfast" | "lunch" | "dinner"; mealId: number };
export type WeightEntry = { date: string; kg: number };
export type Order = { id: string; date: string; items: CartItem[]; total: number; status: "placed" | "cooking" | "out" | "delivered" };

type Store = {
  lang: Lang; setLang: (l: Lang) => void;
  dark: boolean; toggleDark: () => void;

  cart: CartItem[];
  addToCart: (i: CartItem) => void;
  setQty: (mealId: number, base: string | undefined, qty: number) => void;
  clearCart: () => void;
  coupon: string | null; setCoupon: (c: string | null) => void;

  wishlist: number[]; toggleWish: (id: number) => void;

  planner: PlannerSlot[];
  setSlot: (s: PlannerSlot) => void;
  removeSlot: (day: number, slot: PlannerSlot["slot"]) => void;

  weights: WeightEntry[]; addWeight: (e: WeightEntry) => void;
  waterToday: { date: string; glasses: number };
  addWater: (n: number) => void;
  streak: { last: string; days: number };
  markToday: () => void;
  targets: { kcal: number; protein: number } | null;
  setTargets: (t: { kcal: number; protein: number }) => void;

  orders: Order[];
  placeOrder: (o: Order) => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      lang: "en", setLang: (lang) => set({ lang }),
      dark: false, toggleDark: () => set((s) => ({ dark: !s.dark })),

      cart: [],
      addToCart: (i) =>
        set((s) => {
          const ex = s.cart.find((c) => c.mealId === i.mealId && c.base === i.base);
          if (ex)
            return { cart: s.cart.map((c) => (c === ex ? { ...c, qty: c.qty + i.qty } : c)) };
          return { cart: [...s.cart, i] };
        }),
      setQty: (mealId, base, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => !(c.mealId === mealId && c.base === base))
              : s.cart.map((c) => (c.mealId === mealId && c.base === base ? { ...c, qty } : c)),
        })),
      clearCart: () => set({ cart: [], coupon: null }),
      coupon: null, setCoupon: (coupon) => set({ coupon }),

      wishlist: [],
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
        })),

      planner: [],
      setSlot: (slot) =>
        set((s) => ({
          planner: [...s.planner.filter((p) => !(p.day === slot.day && p.slot === slot.slot)), slot],
        })),
      removeSlot: (day, slot) =>
        set((s) => ({ planner: s.planner.filter((p) => !(p.day === day && p.slot === slot)) })),

      weights: [],
      addWeight: (e) =>
        set((s) => ({ weights: [...s.weights.filter((w) => w.date !== e.date), e].sort((a, b) => a.date.localeCompare(b.date)) })),
      waterToday: { date: today(), glasses: 0 },
      addWater: (n) =>
        set((s) => {
          const d = today();
          const cur = s.waterToday.date === d ? s.waterToday.glasses : 0;
          return { waterToday: { date: d, glasses: Math.max(0, cur + n) } };
        }),
      streak: { last: "", days: 0 },
      markToday: () =>
        set((s) => {
          const d = today();
          if (s.streak.last === d) return s;
          const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
          return { streak: { last: d, days: s.streak.last === yest ? s.streak.days + 1 : 1 } };
        }),
      targets: null,
      setTargets: (targets) => set({ targets }),

      orders: [],
      placeOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    { name: "fmc-store" }
  )
);

export const useCartCount = () => useStore((s) => s.cart.reduce((a, c) => a + c.qty, 0));
