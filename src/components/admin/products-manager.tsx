"use client";

import { useState } from "react";
import type { Product, Category } from "@/db/schema";
import { formatPrice } from "@/lib/format";

const empty = {
  name: "",
  slug: "",
  description: "",
  price: "",
  oldPrice: "",
  imageUrl: "",
  categoryId: "",
  team: "",
  season: "",
  sizes: "S,M,L,XL",
  stock: "50",
  featured: false,
  active: true,
};
type Form = typeof empty;

const inp = "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-900";

export function ProductsManager({ initial, categories, openNew }: { initial: Product[]; categories: Category[]; openNew?: boolean }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<Form | null>(openNew ? empty : null);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const reload = async () => setItems(await (await fetch("/api/products")).json());

  function edit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: p.price,
      oldPrice: p.oldPrice || "",
      imageUrl: p.imageUrl || "",
      categoryId: p.categoryId ? String(p.categoryId) : "",
      team: p.team || "",
      season: p.season || "",
      sizes: (p.sizes || []).join(","),
      stock: String(p.stock),
      featured: p.featured,
      active: p.active,
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setErr("");
    const r = await fetch(editId ? `/api/products/${editId}` : "/api/products", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!r.ok) return setErr((await r.json()).error || "Error");
    setForm(null);
    setEditId(null);
    reload();
  }

  async function del(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    reload();
  }

  const list = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || (p.team || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-black">Productos</h1>
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="border rounded-lg px-3 py-2 text-sm bg-white" />
          <button onClick={() => { setEditId(null); setForm(empty); }} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            + Nuevo producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl || ""} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.team} {p.season}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{categories.find((c) => c.id === p.categoryId)?.name || "—"}</td>
                <td className="p-3 font-semibold">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-slate-200"}`}>{p.active ? "Activo" : "Oculto"}</span>
                  {p.featured && <span className="text-xs px-2 py-1 rounded-full bg-lime-100 text-lime-800 ml-1">Destacado</span>}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => edit(p)} className="text-blue-600 font-semibold mr-3">Editar</button>
                  <button onClick={() => del(p.id)} className="text-red-500 font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-8">
            <h2 className="text-xl font-bold mb-4">{editId ? "Editar producto" : "Nuevo producto"}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="sm:col-span-2 text-sm">Nombre<input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label className="text-sm">Equipo<input className={inp} value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} /></label>
              <label className="text-sm">Temporada<input className={inp} value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} /></label>
              <label className="text-sm">Precio (€)<input type="number" step="0.01" className={inp} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
              <label className="text-sm">Precio anterior (opcional)<input type="number" step="0.01" className={inp} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} /></label>
              <label className="text-sm">Categoría
                <select className={inp} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Sin categoría</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="text-sm">Stock<input type="number" className={inp} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label>
              <label className="text-sm">Tallas (separadas por coma)<input className={inp} value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></label>
              <label className="text-sm">URL de imagen<input className={inp} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/images/jersey-white.jpg o https://..." /></label>
              <label className="sm:col-span-2 text-sm">Descripción<textarea rows={3} className={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Destacado en portada</label>
              <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visible en la tienda</label>
            </div>
            {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-3 h-28 rounded-lg object-cover" />}
            {err && <p className="text-red-500 text-sm mt-3">{err}</p>}
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setForm(null); setEditId(null); }} className="px-4 py-2 rounded-lg border text-sm">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
