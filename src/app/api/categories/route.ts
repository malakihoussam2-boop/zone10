import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { parseCategory } from "@/lib/parse";

export async function GET() {
  return NextResponse.json(await getCategories());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const data = parseCategory(await req.json());
  if (!data.name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  try {
    const [c] = await db.insert(categories).values(data).returning();
    return NextResponse.json(c);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
