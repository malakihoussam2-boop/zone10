import Link from "next/link";
import { getConfig } from "@/lib/settings";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const [config, categories, products] = await Promise.all([
    getConfig(),
    getCategories(),
    getProducts({ category: categoria, q }),
  ]);
  const current = categories.find((c) => c.slug === categoria);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black">
          {current ? current.name : q ? `Resultados para "${q}"` : "Todas las camisetas"}
        </h1>
        {current?.description && <p className="text-slate-500 mt-2">{current.description}</p>}
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        <Link
          href="/productos"
          className={`px-4 py-2 rounded-full text-sm font-medium border ${!categoria ? "bg-[var(--primary)] text-white border-transparent" : "bg-white hover:border-slate-400"}`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/productos?categoria=${c.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${categoria === c.slug ? "bg-[var(--primary)] text-white border-transparent" : "bg-white hover:border-slate-400"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="text-slate-500 py-20 text-center">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} currency={config.general.currency} />
          ))}
        </div>
      )}
    </div>
  );
}
