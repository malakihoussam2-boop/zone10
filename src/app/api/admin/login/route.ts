import { NextResponse } from "next/server";
import { adminPassword, setAdminCookie, clearAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== adminPassword()) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
