"use client";

import { useState } from "react";
import type { SiteConfig, SectionKey } from "@/lib/settings";

const sections: { key: SectionKey; label: string; icon: string; desc: string }[] = [
  { key: "general", label: "General", icon: "⚙️", desc: "Nombre, colores, moneda y barra de anuncios" },
  { key: "hero", label: "Portada (Hero)", icon: "🏟️", desc: "Título principal, subtítulo, imagen y botón" },
  { key: "features", label: "Ventajas", icon: "⚡", desc: "Bloques de beneficios bajo la portada" },
  { key: "categoriesSection", label: "Sección categorías", icon: "🗂️", desc: "Títulos de la sección de categorías" },
  { key: "featured", label: "Destacados", icon: "⭐", desc: "Sección de productos destacados" },
  { key: "about", label: "Nosotros", icon: "📖", desc: "Historia, imagen y estadísticas" },
  { key: "testimonials", label: "Testimonios", icon: "💬", desc: "Opiniones de clientes" },
  { key: "newsletter", label: "Newsletter", icon: "✉️", desc: "Bloque de suscripción" },
  { key: "shipping", label: "Envíos y personalización", icon: "🚚", desc: "Costes de envío y precio de personalización" },
  { key: "footer", label: "Pie de página", icon: "🔗", desc: "Contacto, redes sociales y copyright" },
];

const labels: Record<string, string> = {
  storeName: "Nombre de la tienda", tagline: "Eslogan", logoText: "Texto del logo", primaryColor: "Color principal", accentColor: "Color de acento",
  currency: "Símbolo de moneda", announcement: "Texto de la barra de anuncios", showAnnouncement: "Mostrar barra de anuncios",
  title: "Título", subtitle: "Subtítulo", buttonText: "Texto del botón", buttonLink: "Enlace del botón", imageUrl: "URL de imagen", badge: "Etiqueta",
  enabled: "Sección visible", text: "Texto", items: "Elementos", stats: "Estadísticas", icon: "Icono", name: "Nombre", role: "Ciudad / rol",
  value: "Valor", label: "Etiqueta", email: "Email", phone: "Teléfono", address: "Dirección", instagram: "Instagram", facebook: "Facebook",
  tiktok: "TikTok", youtube: "YouTube", copyright: "Copyright", freeFrom: "Envío gratis a partir de (€)", cost: "Coste de envío (€)",
  customizationPrice: "Precio personalización (€)", message: "Mensaje de envío",
};

const inp = "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-900 bg-white";

type Val = string | number | boolean | Record<string, unknown>[];

function Field({ k, v, onChange }: { k: string; v: Val; onChange: (v: Val) => void }) {
  const label = labels[k] || k;
  if (typeof v === "boolean")
    return (
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={v} onChange={(e) => onChange(e.target.checked)} /> {label}
      </label>
    );
  if (typeof v === "number")
    return (
      <label className="text-sm block">
        <span className="font-medium">{label}</span>
        <input type="number" step="0.01" className={inp} value={v} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
      </label>
    );
  if (Array.isArray(v))
    return (
      <div className="text-sm">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-3">
          {v.map((item, i) => (
            <div key={i} className="border rounded-xl p-3 bg-slate-50 grid sm:grid-cols-2 gap-2 relative">
              {Object.entries(item).map(([ik, iv]) => (
                <label key={ik} className={`text-xs ${ik === "text" ? "sm:col-span-2" : ""}`}>
                  <span className="font-medium">{labels[ik] || ik}</span>
                  {ik === "text" ? (
                    <textarea rows={2} className={inp} value={String(iv)} onChange={(e) => { const c = [...v]; c[i] = { ...item, [ik]: e.target.value }; onChange(c); }} />
                  ) : (
                    <input className={inp} value={String(iv)} onChange={(e) => { const c = [...v]; c[i] = { ...item, [ik]: e.target.value }; onChange(c); }} />
                  )}
                </label>
              ))}
              <button onClick={() => onChange(v.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-500 text-xs font-semibold">Quitar</button>
            </div>
          ))}
          <button
            onClick={() => {
              const template = v[0] ? Object.fromEntries(Object.keys(v[0]).map((kk) => [kk, ""])) : { title: "", text: "" };
              onChange([...v, template]);
            }}
            className="text-xs font-semibold border rounded-lg px-3 py-1.5"
          >+ Añadir elemento</button>
        </div>
      </div>
    );
  const long = k === "text" || k === "subtitle" || k === "announcement";
  const color = k.toLowerCase().includes("color");
  return (
    <label className="text-sm block">
      <span className="font-medium">{label}</span>
      {long ? (
        <textarea rows={3} className={inp} value={v} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="flex gap-2">
          {color && <input type="color" value={v} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 border rounded" />}
          <input className={inp} value={v} onChange={(e) => onChange(e.target.value)} />
        </div>
      )}
      {k === "imageUrl" && v && <img src={v} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
    </label>
  );
}

export function SectionsEditor({ initial }: { initial: SiteConfig }) {
  const [config, setConfig] = useState(initial);
  const [active, setActive] = useState<SectionKey>("general");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const data = config[active] as unknown as Record<string, Val>;

  async function save() {
    setSaving(true);
    const r = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: active, value: config[active] }) });
    setSaving(false);
    setMsg(r.ok ? "✅ Guardado. Los cambios ya están visibles en la tienda." : "❌ Error al guardar");
    setTimeout(() => setMsg(""), 3000);
  }

  async function reset() {
    if (!confirm("¿Restaurar esta sección a los valores por defecto?")) return;
    const r = await fetch("/api/settings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: active }) });
    const j = await r.json();
    setConfig({ ...config, [active]: j.value });
    setMsg("↩️ Sección restaurada");
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Secciones del sitio</h1>
      <p className="text-slate-500 mb-6">Edita cualquier parte de la tienda. Los cambios se aplican al instante.</p>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${active === s.key ? "bg-slate-900 text-white" : "bg-white border hover:border-slate-400"}`}
            >
              <span className="font-semibold">{s.icon} {s.label}</span>
              <span className={`block text-xs mt-0.5 ${active === s.key ? "text-white/60" : "text-slate-500"}`}>{s.desc}</span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white rounded-2xl border p-6">
          <div className="space-y-4">
            {Object.entries(data).map(([k, v]) => (
              <Field key={k} k={k} v={v} onChange={(nv) => setConfig({ ...config, [active]: { ...data, [k]: nv } })} />
            ))}
          </div>
          <div className="flex items-center gap-3 mt-6 pt-6 border-t flex-wrap">
            <button onClick={save} disabled={saving} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button onClick={reset} className="border px-5 py-2.5 rounded-lg font-semibold text-sm">Restaurar por defecto</button>
            <a href="/" target="_blank" className="text-sm underline ml-auto">Ver tienda ↗</a>
            {msg && <span className="text-sm w-full">{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
