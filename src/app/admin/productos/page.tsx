import { getCategories, getProducts } from "@/lib/queries";
import { ProductsManager } from "@/components/admin/products-manager";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ nuevo?: string }> }) {
  const { nuevo } = await searchParams;
  const [products, categories] = await Promise.all([getProducts({ includeInactive: true }), getCategories()]);
  return <ProductsManager initial={products} categories={categories} openNew={nuevo === "1"} />;
}
