"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderItem } from "@/db/schema";
import { formatPrice } from "@/lib/format";

type O = Order & { items: OrderItem[] };
const statuses = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];
const colors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  pagado: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export function OrdersManager({ initial }: { initial: O[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const router = useRouter();

  async function setStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">Pedidos</h1>
      {initial.length === 0 && <p className="text-slate-500">Todavía no hay pedidos.</p>}
      <div className="space-y-3">
        {initial.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border">
            <div className="p-4 flex items-center gap-4 flex-wrap cursor-pointer" onClick={() => setOpen(open === o.id ? null : o.id)}>
              <span className="font-black">#{o.id}</span>
              <div className="flex-1 min-w-40">
                <p className="font-semibold">{o.customerName}</p>
                <p className="text-xs text-slate-500">{o.email} · {new Date(o.createdAt).toLocaleString("es-ES")}</p>
              </div>
              <span className="font-bold">{formatPrice(o.total)}</span>
              <select
                value={o.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setStatus(o.id, e.target.value)}
                className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${colors[o.status] || ""}`}
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {open === o.id && (
              <div className="border-t p-4 text-sm grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Artículos</p>
                  {o.items.map((i) => (
                    <p key={i.id}>
                      {i.quantity}× {i.productName} — Talla {i.size}
                      {i.customName || i.customNumber ? ` · ${i.customName} ${i.customNumber}` : ""} — {formatPrice(parseFloat(i.unitPrice) * i.quantity)}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold mb-2">Envío</p>
                  <p>{o.address}</p>
                  <p>{o.postalCode} {o.city}</p>
                  <p>{o.phone}</p>
                  {o.notes && <p className="mt-2 italic text-slate-500">“{o.notes}”</p>}
                  <button
                    onClick={async () => { if (confirm("¿Eliminar pedido?")) { await fetch(`/api/orders/${o.id}`, { method: "DELETE" }); router.refresh(); } }}
                    className="text-red-500 font-semibold mt-3"
                  >Eliminar pedido</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
