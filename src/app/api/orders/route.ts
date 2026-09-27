import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { inArray, eq, sql } from "drizzle-orm";
import { getConfig } from "@/lib/settings";
import { isAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/queries";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await getOrders());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: { productId: number; size: string; customName?: string; customNumber?: string; quantity: number }[] = body.items ?? [];
    if (!items.length) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    if (!body.customerName || !body.email || !body.address || !body.city)
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });

    const config = await getConfig();
    const ids = [...new Set(items.map((i) => Number(i.productId)))];
    const prods = await db.select().from(products).where(inArray(products.id, ids));
    const map = new Map(prods.map((p) => [p.id, p]));

    let subtotal = 0;
    const lines = items.map((i) => {
      const p = map.get(Number(i.productId));
      if (!p) throw new Error("Producto no encontrado");
      const custom = !!(i.customName || i.customNumber);
      const unit = parseFloat(p.price) + (custom ? config.shipping.customizationPrice : 0);
      subtotal += unit * i.quantity;
      return {
        productId: p.id,
        productName: p.name,
        size: i.size,
        customName: i.customName || "",
        customNumber: i.customNumber || "",
        quantity: i.quantity,
        unitPrice: unit.toFixed(2),
      };
    });
    const ship = subtotal >= config.shipping.freeFrom ? 0 : config.shipping.cost;
    const total = (subtotal + ship).toFixed(2);

    const [order] = await db
      .insert(orders)
      .values({
        customerName: String(body.customerName),
        email: String(body.email),
        phone: String(body.phone || ""),
        address: String(body.address),
        city: String(body.city),
        postalCode: String(body.postalCode || ""),
        notes: String(body.notes || ""),
        total,
      })
      .returning();
    await db.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
    for (const l of lines) {
      await db.update(products).set({ stock: sql`GREATEST(${products.stock} - ${l.quantity}, 0)` }).where(eq(products.id, l.productId));
    }
    return NextResponse.json({ id: order.id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
