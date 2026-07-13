import type { Metadata, Viewport } from "next";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { WaFloat } from "@/components/layout/WaFloat";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "FIT MEN COOK Vizag — Cook Healthy · Eat Better · Live Better",
  description:
    "Healthy meal prep & delivery in Visakhapatnam. High-protein, macro-labeled meals, millet-based menus, weekly & monthly plans. Order on WhatsApp.",
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#f5a50a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${manrope.variable} antialiased`}>
        <Navbar />
        <main className="min-h-dvh pb-16 lg:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <WaFloat />
      </body>
    </html>
  );
}
