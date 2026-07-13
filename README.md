# FIT MEN COOK Vizag — Next.js 15 App

Premium healthy meal-prep platform for **FIT MEN COOK, Maddilapalem, Visakhapatnam**.
Stack: **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand · shadcn-style UI**.

## Quick start
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (deploy to Vercel)
```

## Deploy to Vercel
1. Push this folder to a GitHub repo (or drag-drop the folder in Vercel dashboard → New Project).
2. Framework preset: **Next.js** (auto-detected). No env vars needed.
3. Deploy — done.

## Edit business details
All contact info lives in **`lib/config.ts`** — phone, email, address, Instagram, UPI ID.
Menu items live in **`lib/meals.ts`** — copy any object in the `MEALS` array to add a meal.
Coupons & delivery PIN zones: **`lib/coupons.ts`**.
Admin PIN (demo): `components/AdminClient.tsx` → `DEMO_PIN`.

## Feature map

### ✅ Fully working (no backend needed)
- Smart cart (qty, base customization) + coupon codes + PIN-code delivery-zone checker with time estimate
- WhatsApp checkout with pre-filled itemised order + printable invoice
- Wishlist / favourites (persisted on device)
- Weekly meal planner with per-day macro totals → send plan on WhatsApp / add week to cart
- Progress tracker: weight log + SVG trend chart, water intake, clean-eating streaks
- Calorie calculator (Mifflin-St Jeor) that saves targets → **AI Recommend** ranks menu for the user's goal
- Advanced search & filters: category, calories, protein, price, veg/vegan/gluten-free, allergen exclusion, sorting
- Meal detail pages (SSG) with FDA-style Nutrition Facts + animated macro donut
- Reviews & transformations, real-food gallery, chef story, sourcing & hygiene, FAQ accordion
- Subscription plans (Trial ₹299 / Week ₹5,950 / Premium ₹20,999) with WhatsApp manage flow
- Admin dashboard (`/admin`, PIN 1234): device-local orders, top-meals chart, status pipeline, CSV export
- Dark/light mode · English/తెలుగు toggle · mobile bottom nav · PWA manifest (installable)
- Skeleton loading, Framer Motion page/scroll/micro animations, reduced-motion respected

### 🔜 Phase 2 (needs backend — Supabase/Razorpay suggested)
- Online payments (Razorpay/UPI gateway) — currently UPI-on-delivery messaging
- Real cross-device order tracking & push notifications — admin currently shows this device's orders
- Accounts, loyalty points, referral codes, birthday rewards — need a user database
- Live chat — WhatsApp float covers this for now
- Kitchen / delivery-partner apps — build on the same Supabase backend

### Notes
- **PWA icons**: add `public/icon-192.png` and `public/icon-512.png` (logo on amber background) for install prompts.
- **Real photos**: meal cards use branded gradients + emoji; replace by adding an `photo` URL field in `lib/meals.ts` and swapping the `div` for `next/image` in `MealCard.tsx` / `MealDetail.tsx`.
- Admin PIN gate is a **demo** — do not treat it as security; add real auth in Phase 2.
# fitmencookvizag
