import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/queries";
import { parseProduct } from "@/lib/parse";

export async function GET() {
  const admin = await isAdmin();
  return NextResponse.json(await getProducts({ includeInactive: admin }));
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const data = parseProduct(await req.json());
  if (!data.name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  try {
    const [p] = await db.insert(products).values(data).returning();
    return NextResponse.json(p);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
