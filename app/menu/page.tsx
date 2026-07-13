import { Suspense } from "react";
import { MenuClient } from "@/components/menu/MenuClient";

export const metadata = { title: "Menu & Nutrition — FIT MEN COOK Vizag" };

export default function MenuPage() {
  return (
    <Suspense>
      <MenuClient />
    </Suspense>
  );
}
