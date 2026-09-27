import { slugify } from "./format";

export function parseProduct(body: Record<string, unknown>) {
  const name = String(body.name || "").trim();
  return {
    name,
    slug: slugify(String(body.slug || name)),
    description: String(body.description || ""),
    price: Number(body.price || 0).toFixed(2),
    oldPrice: body.oldPrice ? Number(body.oldPrice).toFixed(2) : null,
    imageUrl: String(body.imageUrl || ""),
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    team: String(body.team || ""),
    season: String(body.season || ""),
    sizes: Array.isArray(body.sizes)
      ? (body.sizes as string[])
      : String(body.sizes || "S,M,L,XL").split(",").map((s) => s.trim()).filter(Boolean),
    stock: Number(body.stock ?? 0),
    featured: !!body.featured,
    active: body.active === undefined ? true : !!body.active,
  };
}

export function parseCategory(body: Record<string, unknown>) {
  const name = String(body.name || "").trim();
  return {
    name,
    slug: slugify(String(body.slug || name)),
    description: String(body.description || ""),
    imageUrl: String(body.imageUrl || ""),
    sortOrder: Number(body.sortOrder ?? 0),
  };
}
