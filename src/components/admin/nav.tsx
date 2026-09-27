"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Resumen", icon: "📊" },
  { href: "/admin/productos", label: "Productos", icon: "🎽" },
  { href: "/admin/categorias", label: "Categorías", icon: "🗂️" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "📦" },
  { href: "/admin/secciones", label: "Secciones del sitio", icon: "🎨" },
];

export function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-5 font-black text-xl flex items-center gap-2">
        <span className="w-9 h-9 rounded-lg bg-lime-400 text-slate-900 flex items-center justify-center shrink-0">10</span>
        <span className="hidden md:inline">ZONE 10</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => {
          const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-lime-400 text-slate-900" : "hover:bg-white/10"}`}
            >
              <span>{l.icon}</span>
              <span className="hidden md:inline">{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 space-y-1 text-sm">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10">
          <span>🌐</span>
          <span className="hidden md:inline">Ver tienda</span>
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            router.refresh();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-left"
        >
          <span>🚪</span>
          <span className="hidden md:inline">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
