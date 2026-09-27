"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";

export function CartDrawer({ currency, freeFrom }: { currency: string; freeFrom: number }) {
  const { items, open, setOpen, remove, setQty, subtotal } = useCart();
  if (!open) return null;
  const missing = Math.max(0, freeFrom - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && <p className="text-slate-500 text-center py-10">Tu carrito está vacío.</p>}
          {items.map((i) => (
            <div key={i.key} className="flex gap-3">
              <img src={i.imageUrl} alt={i.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{i.name}</p>
                <p className="text-slate-500">
                  Talla {i.size}
                  {i.customName || i.customNumber ? ` · ${i.customName} ${i.customNumber}`.trimEnd() : ""}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button className="px-2" onClick={() => setQty(i.key, i.quantity - 1)}>-</button>
                    <span className="px-2">{i.quantity}</span>
                    <button className="px-2" onClick={() => setQty(i.key, i.quantity + 1)}>+</button>
                  </div>
                  <span className="font-bold">{formatPrice((i.price + i.customizationPrice) * i.quantity, currency)}</span>
                </div>
                <button onClick={() => remove(i.key)} className="text-xs text-red-500 mt-1">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t space-y-3">
            {missing > 0 ? (
              <p className="text-xs text-slate-600">Te faltan {formatPrice(missing, currency)} para el envío gratis.</p>
            ) : (
              <p className="text-xs text-green-600 font-semibold">¡Tienes envío gratis! 🎉</p>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block text-center bg-[var(--primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90"
            >
              Finalizar compra
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
