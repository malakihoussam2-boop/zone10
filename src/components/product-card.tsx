import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const discount =
    product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price)
      ? Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice)) * 100)
      : 0;
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🎽</div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-[var(--accent)] text-slate-900 text-xs font-bold px-2 py-1 rounded-full">Top</span>
        )}
        {product.stock <= 0 && (
          <span className="absolute inset-0 bg-white/70 flex items-center justify-center font-bold text-slate-700">Agotado</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">{product.team} {product.season && `· ${product.season}`}</p>
        <h3 className="font-semibold mt-1 line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-lg">{formatPrice(product.price, currency)}</span>
          {product.oldPrice && <span className="text-slate-400 line-through text-sm">{formatPrice(product.oldPrice, currency)}</span>}
        </div>
      </div>
    </Link>
  );
}
