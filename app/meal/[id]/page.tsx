import { notFound } from "next/navigation";
import { MEALS, getMeal } from "@/lib/meals";
import { MealDetail } from "@/components/menu/MealDetail";

export function generateStaticParams() {
  return MEALS.map((m) => ({ id: String(m.id) }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = getMeal(Number(id));
  return { title: m ? `${m.name} — FIT MEN COOK` : "Meal" };
}

export default async function MealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = getMeal(Number(id));
  if (!m) notFound();
  return <MealDetail meal={m} />;
}
