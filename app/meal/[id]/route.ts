// app/api/admin/meals/route.ts
// All meal WRITES happen here on the server using the service_role key.
// Every request must carry the correct x-admin-key header (the admin password).
// Customers can never write to the database — the anon key is read-only (RLS).
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const unauthorized = () => NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

function authed(req: Request) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!authed(req)) return unauthorized();
  const body = await req.json().catch(() => null);
  if (!body?.action) return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  const db = admin();

  try {
    if (body.action === "create") {
      const { id: _drop, ...meal } = body.meal ?? {};
      const { data, error } = await db.from("meals").insert(meal).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, meal: data });
    }
    if (body.action === "update") {
      const { id, ...meal } = body.meal ?? {};
      if (!id) throw new Error("Missing id");
      const { data, error } = await db.from("meals").update(meal).eq("id", id).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, meal: data });
    }
    if (body.action === "toggle") {
      const { error } = await db.from("meals").update({ available: !!body.available }).eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    if (body.action === "delete") {
      const { error } = await db.from("meals").delete().eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}