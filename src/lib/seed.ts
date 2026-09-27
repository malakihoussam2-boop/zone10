import { db } from "@/db";
import { categories, products } from "@/db/schema";

let seeded = false;

export async function ensureSeed() {
  if (seeded) return;
  try {
    const existing = await db.select({ id: categories.id }).from(categories).limit(1);
    if (existing.length > 0) {
      seeded = true;
      return;
    }
    const cats = await db
      .insert(categories)
      .values([
        { name: "Clubes", slug: "clubes", description: "Camisetas de los mejores clubes de Europa", imageUrl: "/images/jersey-white.jpg", sortOrder: 1 },
        { name: "Selecciones", slug: "selecciones", description: "Equipaciones oficiales de selecciones nacionales", imageUrl: "/images/jersey-red.jpg", sortOrder: 2 },
        { name: "Retro", slug: "retro", description: "Clásicos que marcaron una época", imageUrl: "/images/jersey-retro.jpg", sortOrder: 3 },
        { name: "Terceras equipaciones", slug: "terceras", description: "Diseños alternativos y ediciones especiales", imageUrl: "/images/jersey-black.jpg", sortOrder: 4 },
      ])
      .returning();
    const byslug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
    await db.insert(products).values([
      { name: "Camiseta Blanca Local 2025/26", slug: "camiseta-blanca-local-2025-26", description: "Camiseta local de la temporada 2025/26. Tejido Dri-Tech transpirable, corte atlético y detalles dorados. Ideal para jugar o para lucir en la grada.", price: "89.99", oldPrice: "99.99", imageUrl: "/images/jersey-white.jpg", categoryId: byslug["clubes"], team: "Madrid", season: "2025/26", sizes: ["S", "M", "L", "XL", "XXL"], stock: 120, featured: true },
      { name: "Camiseta Blaugrana Local 2025/26", slug: "camiseta-blaugrana-local-2025-26", description: "Las clásicas rayas azulgranas en su versión más moderna. Tecnología de evacuación del sudor y ajuste perfecto.", price: "89.99", imageUrl: "/images/jersey-blaugrana.jpg", categoryId: byslug["clubes"], team: "Barcelona", season: "2025/26", sizes: ["S", "M", "L", "XL"], stock: 95, featured: true },
      { name: "Camiseta Selección Roja 2026", slug: "camiseta-seleccion-roja-2026", description: "Camiseta oficial de la selección para el Mundial 2026. Rojo intenso con detalles dorados. Siente el orgullo nacional.", price: "94.99", imageUrl: "/images/jersey-red.jpg", categoryId: byslug["selecciones"], team: "España", season: "2026", sizes: ["S", "M", "L", "XL", "XXL"], stock: 80, featured: true },
      { name: "Camiseta Celeste Albiceleste 2026", slug: "camiseta-celeste-albiceleste-2026", description: "La camiseta campeona. Rayas celestes y blancas con acabado premium y escudo bordado.", price: "94.99", oldPrice: "104.99", imageUrl: "/images/jersey-skyblue.jpg", categoryId: byslug["selecciones"], team: "Argentina", season: "2026", sizes: ["S", "M", "L", "XL"], stock: 60, featured: true },
      { name: "Camiseta Retro Verde 1994", slug: "camiseta-retro-verde-1994", description: "Reedición del icónico diseño geométrico de los 90. Cuello de polo, tejido de algodón piqué y estilo atemporal.", price: "69.99", imageUrl: "/images/jersey-retro.jpg", categoryId: byslug["retro"], team: "Clásicos", season: "1994", sizes: ["S", "M", "L", "XL"], stock: 40, featured: false },
      { name: "Tercera Equipación Negra Neón", slug: "tercera-equipacion-negra-neon", description: "Edición especial en negro con acentos lima neón. Diseño urbano para dentro y fuera del campo.", price: "84.99", imageUrl: "/images/jersey-black.jpg", categoryId: byslug["terceras"], team: "Zone 10 Edition", season: "2025/26", sizes: ["XS", "S", "M", "L", "XL"], stock: 70, featured: true },
    ]);
    seeded = true;
  } catch (e) {
    console.error("Seed error", e);
  }
}
