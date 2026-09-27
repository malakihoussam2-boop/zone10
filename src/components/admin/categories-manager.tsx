"use client";

import { useState } from "react";
import type { Category } from "@/db/schema";

const empty = { name: "", slug: "", description: "", imageUrl: "", sortOrder: "0" };
type Form = typeof empty;
const inp = "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-900";

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<Form | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [err, setErr] = useState("");

  const reload = async () => setItems(await (await fetch("/api/categories")).json());

  async function save() {
    if (!form) return;
    const r = await fetch(editId ? `/api/categories/${editId}` : "/api/categories", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!r.ok) return setErr((await r.json()).error || "Error");
    setForm(null);
    setEditId(null);
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black">Categorías</h1>
        <button onClick={() => { setEditId(null); setForm(empty); }} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Nueva categoría</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border overflow-hidden">
            <div className="h-32 bg-slate-100">{c.imageUrl && <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />}</div>
            <div className="p-4">
              <p className="font-bold">{c.name}</p>
              <p className="text-xs text-slate-500">/{c.slug} · orden {c.sortOrder}</p>
              <p className="text-sm text-slate-600 mt-1">{c.description}</p>
              <div className="mt-3 text-sm">
                <button
                  onClick={() => { setEditId(c.id); setForm({ name: c.name, slug: c.slug, description: c.description || "", imageUrl: c.imageUrl || "", sortOrder: String(c.sortOrder) }); }}
                  className="text-blue-600 font-semibold mr-3"
                >Editar</button>
                <button onClick={async () => { if (confirm("¿Eliminar categoría?")) { await fetch(`/api/categories/${c.id}`, { method: "DELETE" }); reload(); } }} className="text-red-500 font-semibold">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-3">
            <h2 className="text-xl font-bold">{editId ? "Editar categoría" : "Nueva categoría"}</h2>
            <label className="text-sm block">Nombre<input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="text-sm block">Slug (URL)<input className={inp} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="se genera automáticamente" /></label>
            <label className="text-sm block">Descripción<input className={inp} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="text-sm block">URL de imagen<input className={inp} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
            <label className="text-sm block">Orden<input type="number" className={inp} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></label>
            {err && <p className="text-red-500 text-sm">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setForm(null)} className="px-4 py-2 rounded-lg border text-sm">Cancelar</button>
              <button onClick={save} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
