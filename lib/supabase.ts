import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
);

export type MealRow = {
  id: number;
  name: string;
  name_te: string;
  descr: string;
  cat: string[];
  veg: boolean;
  vegan: boolean;
  gluten_free: boolean;
  kcal: number; p: number; c: number; f: number;
  fiber: number; sugar: number; sodium: number;
  price: number; time: number; spice: number;
  serving: string; pop: number; trending: boolean;
  img: string; bg: string;
  allergens: string[];
  ingredients: string;
  benefits: string[];
  bases: string[];
  available: boolean;
};
