import Link from "next/link";
import { db } from "@/db";
import { orders, products, categories } from "@/db/schema";
import { count, sum, desc } from "drizzle-orm";
import { formatPrice } from "@/lib/queries";
import { getConfig } from "@/lib/settings";
import { ensureSeed } from "@/lib/seed";

export default async function AdminHome() {
  await ensureSeed();
  const [[p], [c], [o], recent, config] = await Promise.all([
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(categories),
    db.select({ n: count(), total: sum(orders.total) }).from(orders),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
    getConfig(),
  ]);
  const cur = config.general.currency;
  const cards = [
    { label: "Productos", value: p.n, href: "/admin/productos" },
    { label: "Categorías", value: c.n, href: "/admin/categorias" },
    { label: "Pedidos", value: o.n, href: "/admin/pedidos" },
    { label: "Ingresos", value: formatPrice(o.total ?? 0, cur), href: "/admin/pedidos" },
  ];
  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Resumen</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((k) => (
          <Link key={k.label} href={k.href} className="bg-white rounded-2xl p-6 border hover:shadow-md transition">
            <p className="text-sm text-slate-500">{k.label}</p>
            <p className="text-3xl font-black mt-1">{k.value}</p>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold mb-4">Últimos pedidos</h2>
          {recent.length === 0 && <p className="text-slate-500 text-sm">Todavía no hay pedidos.</p>}
          <ul className="divide-y text-sm">
            {recent.map((r) => (
              <li key={r.id} className="py-3 flex justify-between">
                <span>#{r.id} · {r.customerName}</span>
                <span className="font-semibold">{formatPrice(r.total, cur)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold mb-4">Acciones rápidas</h2>
          <div className="grid gap-2">
            <Link href="/admin/productos?nuevo=1" className="bg-slate-900 text-white rounded-xl px-4 py-3 text-sm font-semibold">+ Añadir producto</Link>
            <Link href="/admin/secciones" className="bg-lime-400 rounded-xl px-4 py-3 text-sm font-semibold">🎨 Editar portada y secciones</Link>
            <Link href="/admin/pedidos" className="border rounded-xl px-4 py-3 text-sm font-semibold">📦 Gestionar pedidos</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
