import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { defaultConfig, getConfig, resetSection, saveSection, type SectionKey } from "@/lib/settings";

export async function GET() {
  return NextResponse.json(await getConfig());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { section, value } = await req.json();
  if (!(section in defaultConfig)) return NextResponse.json({ error: "Sección inválida" }, { status: 400 });
  await saveSection(section as SectionKey, value);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { section } = await req.json();
  if (!(section in defaultConfig)) return NextResponse.json({ error: "Sección inválida" }, { status: 400 });
  await resetSection(section as SectionKey);
  return NextResponse.json({ ok: true, value: defaultConfig[section as SectionKey] });
}
