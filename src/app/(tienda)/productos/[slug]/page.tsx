import { notFound } from "next/navigation";
import Link from "next/link";
import { getConfig } from "@/lib/settings";
import { getProductBySlug, getProducts, formatPrice } from "@/lib/queries";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, config] = await Promise.all([getProductBySlug(slug), getConfig()]);
  if (!product || !product.active) notFound();
  const related = (await getProducts({})).filter((p) => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 4);
  const cur = config.general.currency;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/">Inicio</Link> / <Link href="/productos">Productos</Link> / <span className="text-slate-900">{product.name}</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-3xl overflow-hidden bg-slate-100 aspect-[4/5]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🎽</div>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-500">
            {product.team} {product.season && `· ${product.season}`}
          </p>
          <h1 className="text-3xl md:text-4xl font-black mt-2">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-black">{formatPrice(product.price, cur)}</span>
            {product.oldPrice && <span className="text-slate-400 line-through text-lg">{formatPrice(product.oldPrice, cur)}</span>}
          </div>
          <p className="mt-6 text-slate-600 leading-relaxed">{product.description}</p>
          <div className="mt-8">
            <AddToCart product={product} customizationPrice={config.shipping.customizationPrice} currency={cur} />
          </div>
          <ul className="mt-8 space-y-2 text-sm text-slate-600 border-t pt-6">
            <li>✅ {config.shipping.message}</li>
            <li>✅ Devoluciones gratuitas en 30 días</li>
            <li>✅ Pago seguro</li>
            <li>{product.stock > 0 ? `✅ En stock (${product.stock} unidades)` : "❌ Agotado"}</li>
          </ul>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-black mb-6">También te puede gustar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} currency={cur} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
