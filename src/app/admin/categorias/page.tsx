import { getCategories } from "@/lib/queries";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function AdminCategories() {
  const categories = await getCategories();
  return <CategoriesManager initial={categories} />;
}
