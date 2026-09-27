import Link from "next/link";
import type { SiteConfig } from "@/lib/settings";
import type { Category } from "@/db/schema";

export function Footer({ config, categories }: { config: SiteConfig; categories: Category[] }) {
  const f = config.footer;
  return (
    <footer className="bg-[var(--primary)] text-white/80 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-white font-black text-2xl mb-3">{config.general.logoText}</p>
          <p className="text-sm max-w-md">{f.text}</p>
          <div className="flex gap-3 mt-5 text-sm">
            {f.instagram && <a href={f.instagram} target="_blank" className="hover:text-[var(--accent)]">Instagram</a>}
            {f.facebook && <a href={f.facebook} target="_blank" className="hover:text-[var(--accent)]">Facebook</a>}
            {f.tiktok && <a href={f.tiktok} target="_blank" className="hover:text-[var(--accent)]">TikTok</a>}
            {f.youtube && <a href={f.youtube} target="_blank" className="hover:text-[var(--accent)]">YouTube</a>}
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Tienda</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/productos" className="hover:text-[var(--accent)]">Todos los productos</Link></li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/productos?categoria=${c.slug}`} className="hover:text-[var(--accent)]">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li>{f.email}</li>
            <li>{f.phone}</li>
            <li>{f.address}</li>
            <li><Link href="/contacto" className="hover:text-[var(--accent)]">Formulario de contacto</Link></li>
            <li><Link href="/admin" className="hover:text-[var(--accent)] text-white/40">Panel de administración</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">{f.copyright}</div>
    </footer>
  );
}
