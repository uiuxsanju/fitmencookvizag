export type Coupon = { code: string; label: string; type: "pct" | "flat"; value: number; min: number };
export const COUPONS: Coupon[] = [
  { code: "FITVIZAG10", label: "10% off orders above ₹299", type: "pct", value: 10, min: 299 },
  { code: "PROTEIN50", label: "Flat ₹50 off above ₹499", type: "flat", value: 50, min: 499 },
  { code: "FIRSTBOX", label: "15% off your first order (min ₹199)", type: "pct", value: 15, min: 199 },
];
export function applyCoupon(code: string, subtotal: number) {
  const c = COUPONS.find((x) => x.code === code.toUpperCase().trim());
  if (!c) return { ok: false as const, msg: "Invalid coupon code" };
  if (subtotal < c.min) return { ok: false as const, msg: `Minimum order ${c.min} for this code` };
  const off = c.type === "pct" ? Math.round((subtotal * c.value) / 100) : c.value;
  return { ok: true as const, off, c };
}
export const ZONES: Record<string, { area: string; mins: number }> = {
  "530003": { area: "Maddilapalem", mins: 20 },
  "530013": { area: "MVP Colony", mins: 25 },
  "530017": { area: "Madhurawada", mins: 40 },
  "530016": { area: "Seethammadhara", mins: 25 },
  "530022": { area: "Gajuwaka", mins: 55 },
  "530002": { area: "Old Town / One Town", mins: 45 },
  "530045": { area: "Rushikonda / GITAM", mins: 45 },
  "530007": { area: "Dwaraka Nagar", mins: 30 },
  "530026": { area: "NAD / Gopalapatnam", mins: 50 },
  "531163": { area: "Bheemili", mins: 65 },
};
