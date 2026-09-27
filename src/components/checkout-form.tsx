"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";
import type { SiteConfig } from "@/lib/settings";

export function CheckoutForm({ currency, shipping }: { currency: string; shipping: SiteConfig["shipping"] }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const shipCost = subtotal >= shipping.freeFrom || subtotal === 0 ? 0 : shipping.cost;
  const total = subtotal + shipCost;

  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Tu carrito está vacío.</p>
        <Link href="/productos" className="underline font-semibold">Ir a la tienda</Link>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      customerName: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      city: fd.get("city"),
      postalCode: fd.get("postalCode"),
      notes: fd.get("notes"),
      items: items.map((i) => ({
        productId: i.productId,
        size: i.size,
        customName: i.customName,
        customNumber: i.customNumber,
        quantity: i.quantity,
      })),
    };
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Error al procesar el pedido");
    clear();
    router.push(`/pedido/${data.id}`);
  }

  const input = "w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] bg-white";

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-4">
        <h2 className="font-bold text-lg">Datos de envío</h2>
        <input name="name" required placeholder="Nombre completo" className={input} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="email" type="email" required placeholder="Email" className={input} />
          <input name="phone" placeholder="Teléfono" className={input} />
        </div>
        <input name="address" required placeholder="Dirección" className={input} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="city" required placeholder="Ciudad" className={input} />
          <input name="postalCode" placeholder="Código postal" className={input} />
        </div>
        <textarea name="notes" placeholder="Notas del pedido (opcional)" rows={3} className={input} />
        <div className="border rounded-xl p-4 bg-white text-sm text-slate-600">
          <p className="font-semibold text-slate-900 mb-1">Método de pago</p>
          <label className="flex items-center gap-2"><input type="radio" defaultChecked name="pay" /> Pago contra reembolso</label>
          <label className="flex items-center gap-2 mt-1"><input type="radio" name="pay" /> Transferencia bancaria</label>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button disabled={loading} className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-50">
          {loading ? "Procesando..." : `Confirmar pedido · ${formatPrice(total, currency)}`}
        </button>
      </div>
      <aside className="lg:col-span-2 bg-white rounded-2xl border p-6 h-fit">
        <h2 className="font-bold text-lg mb-4">Resumen</h2>
        <div className="space-y-3 text-sm">
          {items.map((i) => (
            <div key={i.key} className="flex justify-between gap-3">
              <span>
                {i.quantity}× {i.name} <span className="text-slate-500">({i.size}{i.customName ? `, ${i.customName} ${i.customNumber}` : ""})</span>
              </span>
              <span className="font-semibold whitespace-nowrap">{formatPrice((i.price + i.customizationPrice) * i.quantity, currency)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>{shipCost === 0 ? "Gratis" : formatPrice(shipCost, currency)}</span></div>
          <div className="flex justify-between font-black text-lg pt-2"><span>Total</span><span>{formatPrice(total, currency)}</span></div>
        </div>
      </aside>
    </form>
  );
}
