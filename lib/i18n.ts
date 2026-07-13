export type Lang = "en" | "te";
export const DICT: Record<string, { en: string; te: string }> = {
  nav_menu: { en: "Menu", te: "మెనూ" },
  nav_planner: { en: "Planner", te: "ప్లానర్" },
  nav_tracker: { en: "Tracker", te: "ట్రాకర్" },
  nav_plans: { en: "Plans", te: "ప్లాన్స్" },
  nav_about: { en: "About", te: "మా గురించి" },
  nav_home: { en: "Home", te: "హోమ్" },
  order_now: { en: "Order Now", te: "ఆర్డర్ చేయండి" },
  add_cart: { en: "Add to Cart", te: "కార్ట్‌కి యాడ్" },
  hero_1: { en: "Cook Healthy.", te: "ఆరోగ్యంగా వండండి." },
  hero_2: { en: "Eat Better.", te: "మంచిగా తినండి." },
  hero_3: { en: "Live Better.", te: "బాగా జీవించండి." },
  hero_sub: { en: "Macro-labeled, high-protein meals cooked fresh every day in Maddilapalem — millet-based menus, clean ingredients, zero guesswork.", te: "ప్రతి రోజు తాజాగా వండిన హై-ప్రోటీన్ భోజనం — మిల్లెట్ మెనూలు, స్వచ్ఛమైన పదార్థాలు, మాడిలపాలెం నుండి నేరుగా." },
  explore_menu: { en: "Explore Menu", te: "మెనూ చూడండి" },
  trending: { en: "Trending This Week", te: "ఈ వారం ట్రెండింగ్" },
  cart: { en: "Cart", te: "కార్ట్" },
  checkout_wa: { en: "Checkout on WhatsApp", te: "వాట్సాప్‌లో ఆర్డర్" },
  free_delivery: { en: "Free delivery across Visakhapatnam", te: "విశాఖపట్నం అంతటా ఉచిత డెలివరీ" },
};
export const t = (key: string, lang: Lang) => DICT[key]?.[lang] ?? key;
