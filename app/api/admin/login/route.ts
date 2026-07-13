import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = (process.env.ADMIN_PASSWORD || "").trim();
  if (!expected)
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD not set" }, { status: 500 });
  if (String(password).trim() === expected) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false }, { status: 401 });
}