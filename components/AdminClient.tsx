"use client";
import { useMemo, useState } from "react";
import { Download, Lock } from "lucide-react";
import { useStore, type Order } from "@/lib/store";
import { getMeal, MEALS } from "@/lib/meals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { rup, cn } from "@/lib/utils";

const STATUSES: Order["status"][] = ["placed", "cooking", "out", "delivered"];
const SLABEL: Record<Order["status"], string> = { placed: "🧾 Placed", cooking: "👨‍🍳 Cooking", out: "🚚 Out for delivery", delivered: "✅ Delivered" };
const DEMO_PIN = "1234"; // change this — demo gate only, real auth needs a backend

export function AdminClient() {
  const { orders } = useStore();
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [status, setStatus] = useState<Record<string, Order["status"]>>({});

  const stats = useMemo(() => {
    const revenue = orders.reduce((a, o) => a + o.total, 0);
    const items = orders.flatMap((o) => o.items);
    const byMeal = new Map<number, number>();
    items.forEach((i) => byMeal.set(i.mealId, (byMeal.get(i.mealId) ?? 0) + i.qty));
    const top = [...byMeal.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { revenue, count: orders.length, itemCount: items.reduce((a, i) => a + i.qty, 0), top };
  }, [orders]);

  const exportCsv = () => {
    const rows = [["OrderID", "Date", "Items", "Total"]];
    orders.forEach((o) =>
      rows.push([o.id, new Date(o.date).toLocaleString("en-IN"),
        o.items.map((i) => `${getMeal(i.mealId)?.name} x${i.qty}`).join(" | "), String(o.total)])
    );
    const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "fitmencook-orders.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!ok)
    return (
      <div className="mx-auto grid min-h-[60dvh] w-[min(380px,92%)] place-content-center py-12 text-center">
        <Lock className="mx-auto text-muted-fg" size={28} />
        <h1 className="font-display mt-3 text-3xl">Kitchen Admin</h1>
        <p className="mt-1 text-xs text-muted-fg">Demo gate — enter PIN (default 1234). Real authentication needs a backend.</p>
        <div className="mt-4 flex gap-2">
          <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" placeholder="PIN" inputMode="numeric" />
          <Button onClick={() => pin === DEMO_PIN && setOk(true)}>Enter</Button>
        </div>
      </div>
    );

  return (
    <div className="mx-auto w-[min(1180px,94%)] py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
            <span className="h-0.5 w-7 bg-amber-brand" /> Kitchen Admin
          </p>
          <h1 className="font-display text-4xl">Orders & analytics</h1>
        </div>
        <Button variant="soft" size="sm" onClick={exportCsv}><Download size={14} /> Export CSV</Button>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Revenue (this device)", rup(stats.revenue)], ["Orders", String(stats.count)],
          ["Items sold", String(stats.itemCount)], ["Menu size", String(MEALS.length)]].map(([l, v]) => (
          <Card key={l}><CardBody className="text-center">
            <b className="block font-mono text-2xl text-amber-deep">{v}</b>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-fg">{l}</span>
          </CardBody></Card>
        ))}
      </div>

      {/* top meals bar chart */}
      <Card className="mt-6"><CardBody>
        <h3 className="font-display text-xl">Top-selling meals</h3>
        {stats.top.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-fg">No orders yet on this device — checkout from the cart to see analytics.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {stats.top.map(([id, qty]) => {
              const m = getMeal(id)!;
              const max = stats.top[0][1];
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-40 truncate text-xs font-bold sm:w-56">{m.name}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-lg bg-line/40">
                    <div className="grid h-full place-items-end rounded-lg bg-amber-brand pr-2 font-mono text-[11px] font-bold text-ink"
                      style={{ width: `${(qty / max) * 100}%` }}>{qty}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody></Card>

      {/* orders table with status pipeline */}
      <Card className="mt-6"><CardBody>
        <h3 className="font-display text-xl">Recent orders</h3>
        <p className="mt-1 text-xs text-muted-fg">Orders placed via this device&apos;s cart. Live cross-device tracking needs a backend (Phase 2).</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[10px] font-extrabold uppercase tracking-widest text-muted-fg">
                <th className="p-2.5">Order</th><th className="p-2.5">Date</th><th className="p-2.5">Items</th>
                <th className="p-2.5">Total</th><th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-fg">No orders yet.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line">
                  <td className="p-2.5 font-mono font-bold">{o.id}</td>
                  <td className="p-2.5 text-xs">{new Date(o.date).toLocaleString("en-IN")}</td>
                  <td className="max-w-56 p-2.5 text-xs">{o.items.map((i) => `${getMeal(i.mealId)?.name} ×${i.qty}`).join(", ")}</td>
                  <td className="p-2.5 font-mono font-bold">{rup(o.total)}</td>
                  <td className="p-2.5">
                    <div className="flex flex-wrap gap-1">
                      {STATUSES.map((s) => (
                        <button key={s} onClick={() => setStatus({ ...status, [o.id]: s })}
                          className={cn("cursor-pointer rounded-full border px-2 py-1 text-[10px] font-bold",
                            (status[o.id] ?? o.status) === s ? "border-amber-brand bg-amber-brand/15 text-amber-deep" : "border-line text-muted-fg")}>
                          {SLABEL[s]}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody></Card>
    </div>
  );
}
