"use client";
// lib/useMeals.ts — live meals from Supabase for customer pages.
// Falls back to the static list in lib/meals.ts while loading or if
// Supabase is unreachable, so the site never shows an empty menu.
import { useEffect, useState } from "react";
import { supabase, type MealRow } from "@/lib/supabase";
import { MEALS as STATIC_MEALS, type Meal } from "@/lib/meals";

export function rowToMeal(r: MealRow): Meal {
  return {
    id: r.id,
    name: r.name,
    nameTe: r.name_te,
    desc: r.descr,
    cat: r.cat,
    veg: r.veg,
    vegan: r.vegan || undefined,
    glutenFree: r.gluten_free || undefined,
    kcal: r.kcal, p: r.p, c: r.c, f: r.f,
    fiber: r.fiber, sugar: r.sugar, sodium: r.sodium,
    price: r.price, time: r.time,
    spice: (r.spice as Meal["spice"]) ?? 1,
    serving: r.serving, pop: r.pop,
    trending: r.trending || undefined,
    img: r.img, bg: r.bg,
    allergens: r.allergens,
    ingredients: r.ingredients,
    benefits: r.benefits,
    bases: r.bases.length ? r.bases : undefined,
  };
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>(STATIC_MEALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("meals")
      .select("*")
      .eq("available", true)
      .order("pop", { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return;
        if (!error && data && data.length) setMeals((data as MealRow[]).map(rowToMeal));
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return { meals, loading, getMeal: (id: number) => meals.find((m) => m.id === id) };
}