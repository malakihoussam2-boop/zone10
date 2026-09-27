import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc } from "drizzle-orm";
import { OrdersManager } from "@/components/admin/orders-manager";

export default async function AdminOrders() {
  const [list, items] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(orderItems),
  ]);
  const withItems = list.map((o) => ({ ...o, items: items.filter((i) => i.orderId === o.id) }));
  return <OrdersManager initial={withItems} />;
}
