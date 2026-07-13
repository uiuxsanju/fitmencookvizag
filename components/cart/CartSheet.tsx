"use client";
import { useMemo, useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { getMeal } from "@/lib/meals";
import { applyCoupon, ZONES, COUPONS } from "@/lib/coupons";
import { CONFIG, wa } from "@/lib/config";
import { rup } from "@/lib/utils";
import { Minus, Plus, Trash2, Ticket, MapPin, FileDown } from "lucide-react";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, setQty, clearCart, coupon, setCoupon, placeOrder } = useStore();
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [err, setErr] = useState("");

  const rows = cart.map((c) => ({ ...c, meal: getMeal(c.mealId)! })).filter((r) => r.meal);
  const subtotal = rows.reduce((a, r) => a + r.meal.price * r.qty, 0);
  const disc = useMemo(() => {
    if (!coupon) return 0;
    const r = applyCoupon(coupon, subtotal);
    return r.ok ? r.off : 0;
  }, [coupon, subtotal]);
  const total = subtotal - disc;

  const tryCoupon = () => {
    const r = applyCoupon(code, subtotal);
    if (r.ok) { setCoupon(code.toUpperCase().trim()); setErr(""); }
    else { setErr(r.msg); setCoupon(null); }
  };
  const checkPin = () => {
    const z = ZONES[pin.trim()];
    setPinMsg(
      z
        ? { ok: true, msg: `✅ We deliver to ${z.area}! Est. delivery ~${z.mins} min after dispatch.` }
        : { ok: false, msg: "😕 PIN not in our current zones — WhatsApp us, we may still arrange it." }
    );
  };

  const orderMsg = () => {
    const lines = rows.map(
      (r) => `• ${r.meal.name}${r.base ? ` (${r.base})` : ""} × ${r.qty} — ${rup(r.meal.price * r.qty)}`
    );
    return [
      `Hi ${CONFIG.brand}! New order 🍱`,
      ...lines,
      `Subtotal: ${rup(subtotal)}`,
      coupon ? `Coupon ${coupon}: −${rup(disc)}` : "",
      `*Total: ${rup(total)}*`,
      pin && pinMsg?.ok ? `Delivery PIN: ${pin}` : "",
      `Please confirm delivery time & address. Thank you!`,
    ].filter(Boolean).join("\n");
  };

  const checkout = () => {
    placeOrder({
      id: "FMC" + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      items: cart, total,
      status: "placed",
    });
    window.open(wa(orderMsg()), "_blank", "noopener");
  };

  const invoice = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>FIT MEN COOK Invoice</title>
      <style>body{font-family:system-ui;padding:32px;max-width:640px;margin:auto}
      h1{letter-spacing:1px}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}
      table{width:100%;border-collapse:collapse;margin:16px 0}.tot{font-weight:800}</style></head><body>
      <h1>FIT<span style="color:#f5a50a">MEN</span>⨯COOK</h1>
      <p>${CONFIG.address}<br>${CONFIG.phoneDisplay} · ${CONFIG.email}</p>
      <p><b>Invoice</b> · ${new Date().toLocaleString("en-IN")}</p>
      <table><tr><th>Item</th><th>Qty</th><th>Amount</th></tr>
      ${rows.map((r) => `<tr><td>${r.meal.name}${r.base ? ` (${r.base})` : ""}</td><td>${r.qty}</td><td>${rup(r.meal.price * r.qty)}</td></tr>`).join("")}
      <tr><td class="tot">Subtotal</td><td></td><td>${rup(subtotal)}</td></tr>
      ${disc ? `<tr><td>Coupon ${coupon}</td><td></td><td>−${rup(disc)}</td></tr>` : ""}
      <tr class="tot"><td>Total</td><td></td><td>${rup(total)}</td></tr></table>
      <p style="color:#888;font-size:12px">Thank you for eating clean with us 💪</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <Sheet open={open} onClose={onClose} title={`🛒 Your Cart (${rows.length})`}>
      {rows.length === 0 ? (
        <div className="py-16 text-center text-muted-fg font-semibold">
          Cart is empty — go grab some protein! 💪
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={`${r.mealId}-${r.base}`} className="card-surface flex gap-3 rounded-2xl p-3">
              <div className="grid size-16 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: r.meal.bg }}>
                {r.meal.img}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{r.meal.name}</p>
                {r.base && <p className="text-xs text-muted-fg">Base: {r.base}</p>}
                <p className="font-mono text-sm font-bold">{rup(r.meal.price)} <span className="text-muted-fg text-xs">× {r.qty}</span></p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => setQty(r.mealId, r.base, 0)} aria-label="Remove" className="text-muted-fg hover:text-chili cursor-pointer"><Trash2 size={15} /></button>
                <div className="flex items-center gap-2">
                  <button className="grid size-7 place-items-center rounded-lg border border-line cursor-pointer" onClick={() => setQty(r.mealId, r.base, r.qty - 1)} aria-label="Decrease"><Minus size={13} /></button>
                  <b className="w-4 text-center font-mono text-sm">{r.qty}</b>
                  <button className="grid size-7 place-items-center rounded-lg border border-line cursor-pointer" onClick={() => setQty(r.mealId, r.base, r.qty + 1)} aria-label="Increase"><Plus size={13} /></button>
                </div>
              </div>
            </div>
          ))}

          {/* coupon */}
          <div className="card-surface rounded-2xl p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-fg"><Ticket size={14} /> Coupon code</p>
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="FITVIZAG10" />
              <Button size="sm" onClick={tryCoupon}>Apply</Button>
            </div>
            {coupon && <p className="mt-2 text-xs font-bold text-leaf">✅ {coupon} applied — saved {rup(disc)}</p>}
            {err && <p className="mt-2 text-xs font-bold text-chili">{err}</p>}
            <p className="mt-2 text-[11px] text-muted-fg">Try: {COUPONS.map((c) => c.code).join(" · ")}</p>
          </div>

          {/* pin checker */}
          <div className="card-surface rounded-2xl p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-fg"><MapPin size={14} /> Delivery zone check</p>
            <div className="flex gap-2">
              <Input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN e.g. 530003" inputMode="numeric" maxLength={6} />
              <Button size="sm" variant="dark" onClick={checkPin}>Check</Button>
            </div>
            {pinMsg && <p className={`mt-2 text-xs font-bold ${pinMsg.ok ? "text-leaf" : "text-chili"}`}>{pinMsg.msg}</p>}
          </div>

          {/* totals */}
          <div className="card-surface space-y-1 rounded-2xl p-4 font-mono text-sm">
            <div className="flex justify-between"><span>Subtotal</span><b>{rup(subtotal)}</b></div>
            {disc > 0 && <div className="flex justify-between text-leaf"><span>Coupon</span><b>−{rup(disc)}</b></div>}
            <div className="flex justify-between border-t border-line pt-2 text-base"><span className="font-extrabold">Total</span><b>{rup(total)}</b></div>
          </div>

          <Button variant="wa" className="w-full" size="lg" onClick={checkout}>📲 {`Checkout on WhatsApp — ${rup(total)}`}</Button>
          <div className="flex gap-2">
            <Button variant="soft" className="flex-1" size="sm" onClick={invoice}><FileDown size={14} /> Invoice</Button>
            <Button variant="soft" className="flex-1" size="sm" onClick={clearCart}>Clear cart</Button>
          </div>
          <p className="text-center text-[11px] text-muted-fg">
            UPI on delivery accepted · Online payment gateway coming soon
          </p>
        </div>
      )}
    </Sheet>
  );
}
