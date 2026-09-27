export function formatPrice(v: string | number, currency = "€") {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return `${n.toFixed(2).replace(".", ",")} ${currency}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
