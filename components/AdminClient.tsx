"use client";
// ============================================================
// FITMEN COOK — Kitchen Admin v2
// Real login (server-checked) + Products management (Supabase)
// + Orders analytics. Customers can never reach the panel or
// write to the database.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { Download, Lock, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useStore, type Order } from "@/lib/store";
import { getMeal, MEALS, CATS, ALLERGENS } from "@/lib/meals";
import { supabase, type MealRow } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { rup, cn } from "@/lib/utils";

const STATUSES: Order["status"][] = ["placed", "cooking", "out", "delivered"];
const SLABEL: Record<Order["status"], string> = { placed: "🧾 Placed", cooking: "👨‍🍳 Cooking", out: "🚚 Out for delivery", delivered: "✅ Delivered" };

const EMPTY_ROW: Omit<MealRow, "id"> = {
  name: "", name_te: "", descr: "", cat: [], veg: true, vegan: false, gluten_free: false,
  kcal: 0, p: 0, c: 0, f: 0, fiber: 0, sugar: 0, sodium: 0,
  price: 0, time: 15, spice: 1, serving: "", pop: 50, trending: false,
  img: "🍱", bg: "linear-gradient(135deg,#fde8cf,#f7c873)",
  allergens: [], ingredients: "", benefits: [], bases: [], available: true,
};

// ---------------- Meal editor form ----------------
function MealEditor({ row, onClose, onSaved, adminKey }: {
  row: MealRow | null; onClose: () => void; onSaved: () => void; adminKey: string;
}) {
  const [f, setF] = useState<Omit<MealRow, "id"> & { id?: number }>(row ?? EMPTY_ROW);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggleIn = (k: "cat" | "allergens", v: string) =>
    set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);

  const num = (v: string) => (Number.isFinite(+v) ? +v : 0);

  const save = async () => {
    if (!f.name.trim() || !f.price) { setErr("Name and price are required."); return; }
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ action: row ? "update" : "create", meal: f }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "Network error" }));
    setBusy(false);
    if (data.ok) { onSaved(); onClose(); }
    else setErr(data.error || "Save failed");
  };

  const L = "text-[10px] font-extrabold uppercase tracking-widest text-muted-fg";
  const I = "mt-1 w-full rounded-xl border border-line bg-transparent px-3 py-2 text-sm font-bold outline-none focus:border-amber-brand";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90dvh] w-[min(760px,100%)] overflow-y-auto rounded-3xl border border-line bg-cream p-6 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">{row ? `Edit — ${row.name}` : "Add new meal"}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-line/40"><X size={18} /></button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className={L}>Meal name *<input className={I} value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
          <label className={L}>Telugu name<input className={I} value={f.name_te} onChange={(e) => set("name_te", e.target.value)} /></label>
          <label className={`${L} sm:col-span-2`}>Description<input className={I} value={f.descr} onChange={(e) => set("descr", e.target.value)} /></label>
          <label className={L}>Price (₹) *<input className={I} type="number" value={f.price} onChange={(e) => set("price", num(e.target.value))} /></label>
          <label className={L}>Serving<input className={I} value={f.serving} onChange={(e) => set("serving", e.target.value)} placeholder="1 box (350g)" /></label>
          <label className={L}>Emoji image<input className={I} value={f.img} onChange={(e) => set("img", e.target.value)} placeholder="🍗🥦" /></label>
          <label className={L}>Prep time (min)<input className={I} type="number" value={f.time} onChange={(e) => set("time", num(e.target.value))} /></label>
        </div>

        {/* macros */}
        <p className={`mt-5 ${L}`}>Nutrition (per serving)</p>
        <div className="mt-1 grid grid-cols-3 gap-3 sm:grid-cols-7">
          {([["kcal","kcal"],["p","Protein g"],["c","Carbs g"],["f","Fat g"],["fiber","Fiber g"],["sugar","Sugar g"],["sodium","Sodium mg"]] as const).map(([k, l]) => (
            <label key={k} className={L}>{l}
              <input className={I} type="number" value={f[k]} onChange={(e) => set(k, num(e.target.value))} />
            </label>
          ))}
        </div>

        {/* flags */}
        <div className="mt-5 flex flex-wrap gap-2">
          {([["veg","🟢 Veg"],["vegan","🌱 Vegan"],["gluten_free","🌾 Gluten-free"],["trending","🔥 Trending"],["available","✅ Available"]] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => set(k, !f[k])} aria-pressed={!!f[k]}
              className={cn("rounded-full border px-3 py-1.5 text-xs font-bold",
                f[k] ? "border-amber-brand bg-amber-brand/15 text-amber-deep" : "border-line text-muted-fg")}>
              {l}
            </button>
          ))}
          <label className={`${L} ml-auto flex items-center gap-2`}>Spice
            <select value={f.spice} onChange={(e) => set("spice", num(e.target.value))}
              className="rounded-xl border border-line bg-transparent px-2 py-1.5 text-sm font-bold">
              <option value={0}>None</option><option value={1}>🌶</option><option value={2}>🌶🌶</option><option value={3}>🌶🌶🌶</option>
            </select>
          </label>
        </div>

        {/* categories */}
        <p className={`mt-5 ${L}`}>Categories (menu filters)</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {CATS.filter((c) => c.k !== "all").map((c) => (
            <button key={c.k} type="button" onClick={() => toggleIn("cat", c.k)} aria-pressed={f.cat.includes(c.k)}
              className={cn("rounded-full border px-3 py-1.5 text-xs font-bold",
                f.cat.includes(c.k) ? "border-amber-brand bg-amber-brand/15 text-amber-deep" : "border-line text-muted-fg")}>
              {c.l}
            </button>
          ))}
        </div>

        {/* allergens */}
        <p className={`mt-5 ${L}`}>Allergens</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {ALLERGENS.map((a) => (
            <button key={a} type="button" onClick={() => toggleIn("allergens", a)} aria-pressed={f.allergens.includes(a)}
              className={cn("rounded-full border px-3 py-1.5 text-xs font-bold",
                f.allergens.includes(a) ? "border-[#e2574c] bg-[#e2574c]/10 text-[#e2574c]" : "border-line text-muted-fg")}>
              {a}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className={L}>Ingredients (comma separated)
            <textarea className={`${I} min-h-20`} value={f.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
          </label>
          <label className={L}>Benefits (one per line)
            <textarea className={`${I} min-h-20`} value={f.benefits.join("\n")}
              onChange={(e) => set("benefits", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
          </label>
          <label className={`${L} sm:col-span-2`}>Rice bases (comma separated, optional)
            <input className={I} value={f.bases.join(", ")}
              onChange={(e) => set("bases", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="White Rice, Brown Rice, Quinoa, Millet" />
          </label>
        </div>

        {err && <p className="mt-4 rounded-xl bg-[#e2574c]/10 p-3 text-sm font-bold text-[#e2574c]">{err}</p>}

        <div className="mt-6 flex gap-2">
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : row ? "💾 Save changes" : "➕ Add meal"}</Button>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Products tab ----------------
function ProductsTab({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<MealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MealRow | null | "new">(null);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true); setErr("");
    const { data, error } = await supabase.from("meals").select("*").order("id");
    if (error) setErr(error.message);
    else setRows((data as MealRow[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const call = async (payload: object) => {
    const res = await fetch("/api/admin/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "Network error" }));
    if (!data.ok) setErr(data.error || "Action failed");
    return data.ok;
  };

  const toggle = async (r: MealRow) => {
    if (await call({ action: "toggle", id: r.id, available: !r.available }))
      setRows((p) => p.map((x) => (x.id === r.id ? { ...x, available: !r.available } : x)));
  };
  const del = async (r: MealRow) => {
    if (!confirm(`Delete "${r.name}" permanently? This cannot be undone.`)) return;
    if (await call({ action: "delete", id: r.id })) setRows((p) => p.filter((x) => x.id !== r.id));
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-fg">{rows.length} meals · changes go live for all customers instantly.</p>
        <div className="flex gap-2">
          <Button variant="soft" size="sm" onClick={load}><RefreshCw size={14} /> Refresh</Button>
          <Button size="sm" onClick={() => setEditing("new")}><Plus size={14} /> Add meal</Button>
        </div>
      </div>

      {err && <p className="mt-3 rounded-xl bg-[#e2574c]/10 p-3 text-sm font-bold text-[#e2574c]">{err}</p>}

      <Card className="mt-4"><CardBody>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-fg">Loading meals from database…</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-fg">
            No meals in the database yet. Run the schema SQL in Supabase first, then hit Refresh.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[10px] font-extrabold uppercase tracking-widest text-muted-fg">
                  <th className="p-2.5">Meal</th><th className="p-2.5">Price</th><th className="p-2.5">Kcal / P</th>
                  <th className="p-2.5">Type</th><th className="p-2.5">Status</th><th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={cn("border-b border-line", !r.available && "opacity-50")}>
                    <td className="p-2.5">
                      <span className="mr-2">{r.img}</span>
                      <b>{r.name}</b>
                      {r.trending && <span className="ml-2 text-xs">🔥</span>}
                    </td>
                    <td className="p-2.5 font-mono font-bold">{rup(r.price)}</td>
                    <td className="p-2.5 font-mono text-xs">{r.kcal} / {r.p}g</td>
                    <td className="p-2.5 text-xs">{r.vegan ? "🌱 Vegan" : r.veg ? "🟢 Veg" : "🔴 Non-veg"}</td>
                    <td className="p-2.5">
                      <button onClick={() => toggle(r)}
                        className={cn("rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                          r.available ? "border-leaf/40 bg-leaf/10 text-leaf" : "border-line text-muted-fg")}>
                        {r.available ? "Live" : "Hidden"}
                      </button>
                    </td>
                    <td className="p-2.5">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => setEditing(r)} aria-label={`Edit ${r.name}`}
                          className="rounded-lg border border-line p-2 hover:border-amber-brand"><Pencil size={14} /></button>
                        <button onClick={() => del(r)} aria-label={`Delete ${r.name}`}
                          className="rounded-lg border border-line p-2 text-[#e2574c] hover:border-[#e2574c]"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody></Card>

      {editing !== null && (
        <MealEditor row={editing === "new" ? null : editing} adminKey={adminKey}
          onClose={() => setEditing(null)} onSaved={load} />
      )}
    </>
  );
}

// ---------------- Orders tab (existing analytics) ----------------
function OrdersTab() {
  const { orders } = useStore();
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

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button variant="soft" size="sm" onClick={exportCsv}><Download size={14} /> Export CSV</Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Revenue (this device)", rup(stats.revenue)], ["Orders", String(stats.count)],
          ["Items sold", String(stats.itemCount)], ["Menu size", String(MEALS.length)]].map(([l, v]) => (
          <Card key={l}><CardBody className="text-center">
            <b className="block font-mono text-2xl text-amber-deep">{v}</b>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-fg">{l}</span>
          </CardBody></Card>
        ))}
      </div>

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
    </>
  );
}

// ---------------- Main ----------------
export function AdminClient() {
  const [pw, setPw] = useState("");
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [loginErr, setLoginErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"products" | "orders">("products");

  // restore session (survives page refresh, cleared when tab closes)
  useEffect(() => {
    const k = sessionStorage.getItem("fmc-admin-key");
    if (k) setAdminKey(k);
  }, []);

  const login = async () => {
    setBusy(true); setLoginErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      sessionStorage.setItem("fmc-admin-key", pw);
      setAdminKey(pw);
    } else {
      const d = await res.json().catch(() => ({}));
      setLoginErr(d.error || "Wrong password.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("fmc-admin-key");
    setAdminKey(null); setPw("");
  };

  if (!adminKey)
    return (
      <div className="mx-auto grid min-h-[60dvh] w-[min(380px,92%)] place-content-center py-12 text-center">
        <Lock className="mx-auto text-muted-fg" size={28} />
        <h1 className="font-display mt-3 text-3xl">Kitchen Admin</h1>
        <p className="mt-1 text-xs text-muted-fg">Staff only. Enter the admin password.</p>
        <div className="mt-4 flex gap-2">
          <Input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Password"
            onKeyDown={(e) => e.key === "Enter" && login()} />
          <Button onClick={login} disabled={busy}>{busy ? "…" : "Enter"}</Button>
        </div>
        {loginErr && <p className="mt-3 text-sm font-bold text-[#e2574c]">{loginErr}</p>}
      </div>
    );

  return (
    <div className="mx-auto w-[min(1180px,94%)] py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">
            <span className="h-0.5 w-7 bg-amber-brand" /> Kitchen Admin
          </p>
          <h1 className="font-display text-4xl">Manage everything</h1>
        </div>
        <Button variant="soft" size="sm" onClick={logout}>Log out</Button>
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-2 border-b border-line">
        {([["products", "🍱 Products"], ["orders", "📦 Orders & analytics"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k}
            className={cn("border-b-2 px-4 py-2.5 text-sm font-extrabold",
              tab === k ? "border-amber-brand text-amber-deep" : "border-transparent text-muted-fg hover:text-ink")}>
            {l}
          </button>
        ))}
      </div>

      {tab === "products" ? <ProductsTab adminKey={adminKey} /> : <OrdersTab />}
    </div>
  );
}