import { db } from "@/db";
import { categories, products, orders, orderItems } from "@/db/schema";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { ensureSeed } from "./seed";

export async function getCategories() {
  await ensureSeed();
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getProducts(opts: { category?: string; q?: string; featured?: boolean; includeInactive?: boolean } = {}) {
  await ensureSeed();
  const conds = [];
  if (!opts.includeInactive) conds.push(eq(products.active, true));
  if (opts.featured) conds.push(eq(products.featured, true));
  if (opts.q) conds.push(or(ilike(products.name, `%${opts.q}%`), ilike(products.team, `%${opts.q}%`)));
  let categoryId: number | undefined;
  if (opts.category) {
    const [c] = await db.select().from(categories).where(eq(categories.slug, opts.category));
    if (c) categoryId = c.id;
    else return [];
  }
  if (categoryId) conds.push(eq(products.categoryId, categoryId));
  return db
    .select()
    .from(products)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(products.featured), desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
  await ensureSeed();
  const [p] = await db.select().from(products).where(eq(products.slug, slug));
  return p ?? null;
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(id: number) {
  const [o] = await db.select().from(orders).where(eq(orders.id, id));
  if (!o) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...o, items };
}

export { slugify, formatPrice } from "./format";
