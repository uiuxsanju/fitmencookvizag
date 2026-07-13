// app/api/admin/login/route.ts
// Checks the admin password on the SERVER — the real password lives in
// .env.local (ADMIN_PASSWORD) and is never shipped to the browser.
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!process.env.ADMIN_PASSWORD)
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD not set in .env.local" }, { status: 500 });
  if (password === process.env.ADMIN_PASSWORD) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false }, { status: 401 });
}