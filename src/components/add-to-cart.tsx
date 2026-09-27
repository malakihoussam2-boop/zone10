"use client";

import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";

export function AddToCart({ product, customizationPrice, currency }: { product: Product; customizationPrice: number; currency: string }) {
  const { add } = useCart();
  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const [size, setSize] = useState("");
  const [custom, setCustom] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");

  const total = (parseFloat(product.price) + (custom ? customizationPrice : 0)) * qty;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-semibold mb-2">Talla</p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => { setSize(s); setErr(""); }}
              className={`min-w-12 px-3 py-2 rounded-lg border font-semibold text-sm transition ${size === s ? "bg-[var(--primary)] text-white border-transparent" : "bg-white hover:border-slate-500"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border rounded-xl p-4 bg-white">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} className="w-4 h-4" />
          <span className="font-semibold">Personalizar con nombre y dorsal</span>
          <span className="text-sm text-slate-500 ml-auto">+{formatPrice(customizationPrice, currency)}</span>
        </label>
        {custom && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))}
              placeholder="NOMBRE"
              className="col-span-2 border rounded-lg px-3 py-2 uppercase"
            />
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="10"
              className="border rounded-lg px-3 py-2 text-center"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex items-center border rounded-xl bg-white">
          <button className="px-4 py-3" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span className="px-3 font-semibold">{qty}</span>
          <button className="px-4 py-3" onClick={() => setQty(qty + 1)}>+</button>
        </div>
        <button
          disabled={product.stock <= 0}
          onClick={() => {
            if (!size) return setErr("Selecciona una talla.");
            add({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              imageUrl: product.imageUrl || "",
              price: parseFloat(product.price),
              size,
              customName: custom ? name : "",
              customNumber: custom ? number : "",
              customizationPrice: custom ? customizationPrice : 0,
              quantity: qty,
            });
          }}
          className="flex-1 bg-[var(--primary)] text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition"
        >
          {product.stock <= 0 ? "Agotado" : `Añadir al carrito · ${formatPrice(total, currency)}`}
        </button>
      </div>
      {err && <p className="text-red-500 text-sm">{err}</p>}
    </div>
  );
}
