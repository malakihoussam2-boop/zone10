"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-context";
import type { SiteConfig } from "@/lib/settings";
import type { Category } from "@/db/schema";

export function Header({ config, categories }: { config: SiteConfig; categories: Category[] }) {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <>
      {config.general.showAnnouncement && config.general.announcement && (
        <div className="bg-[var(--accent)] text-slate-900 text-center text-xs sm:text-sm font-semibold py-2 px-4">
          {config.general.announcement}
        </div>
      )}
      <header className="sticky top-0 z-40 bg-[var(--primary)]/95 backdrop-blur text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tight">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent)] text-slate-900 text-lg">
              10
            </span>
            <span>{config.general.logoText}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/productos" className="hover:text-[var(--accent)] transition">
              Todos
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/productos?categoria=${c.slug}`} className="hover:text-[var(--accent)] transition">
                {c.name}
              </Link>
            ))}
            <Link href="/#nosotros" className="hover:text-[var(--accent)] transition">
              Nosotros
            </Link>
            <Link href="/contacto" className="hover:text-[var(--accent)] transition">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <form action="/productos" className="hidden lg:block">
              <input
                name="q"
                placeholder="Buscar camiseta..."
                className="bg-white/10 rounded-full px-4 py-1.5 text-sm placeholder:text-white/50 outline-none focus:bg-white/20 w-48"
              />
            </form>
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Carrito"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M6 6L5 3H2" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" onClick={() => setMenu(!menu)} aria-label="Menú">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
            <form action="/productos">
              <input name="q" placeholder="Buscar camiseta..." className="w-full bg-white/10 rounded-full px-4 py-2 text-sm outline-none" />
            </form>
            <Link href="/productos" onClick={() => setMenu(false)}>Todos los productos</Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/productos?categoria=${c.slug}`} onClick={() => setMenu(false)}>
                {c.name}
              </Link>
            ))}
            <Link href="/contacto" onClick={() => setMenu(false)}>Contacto</Link>
          </nav>
        )}
      </header>
    </>
  );
}
