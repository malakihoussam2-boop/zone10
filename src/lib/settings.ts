import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export type SiteConfig = {
  general: {
    storeName: string;
    tagline: string;
    logoText: string;
    primaryColor: string;
    accentColor: string;
    currency: string;
    announcement: string;
    showAnnouncement: boolean;
  };
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    badge: string;
  };
  features: {
    title: string;
    items: { icon: string; title: string; text: string }[];
  };
  featured: { title: string; subtitle: string; enabled: boolean };
  categoriesSection: { title: string; subtitle: string; enabled: boolean };
  about: {
    enabled: boolean;
    title: string;
    text: string;
    imageUrl: string;
    stats: { value: string; label: string }[];
  };
  testimonials: {
    enabled: boolean;
    title: string;
    items: { name: string; text: string; role: string }[];
  };
  newsletter: { enabled: boolean; title: string; text: string; buttonText: string };
  footer: {
    text: string;
    email: string;
    phone: string;
    address: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    copyright: string;
  };
  shipping: { freeFrom: number; cost: number; customizationPrice: number; message: string };
};

export const defaultConfig: SiteConfig = {
  general: {
    storeName: "Zone 10",
    tagline: "Camisetas de fútbol para auténticos jugadores",
    logoText: "ZONE 10",
    primaryColor: "#0f172a",
    accentColor: "#84cc16",
    currency: "€",
    announcement: "🚚 Envío gratis en pedidos superiores a 60€ · Personalización de nombre y número disponible",
    showAnnouncement: true,
  },
  hero: {
    badge: "Nueva temporada 2025/26",
    title: "Viste como los grandes. Juega como tú.",
    subtitle:
      "Camisetas oficiales y réplicas de la máxima calidad de los mejores clubes y selecciones. Personaliza tu equipación con tu nombre y número.",
    buttonText: "Ver colección",
    buttonLink: "/productos",
    imageUrl: "/images/hero.jpg",
  },
  features: {
    title: "¿Por qué Zone 10?",
    items: [
      { icon: "⚡", title: "Envío rápido", text: "Recibe tu pedido en 24-72h en toda España." },
      { icon: "🎽", title: "Calidad premium", text: "Tejidos transpirables de alto rendimiento." },
      { icon: "✏️", title: "Personalización", text: "Añade tu nombre y dorsal favorito." },
      { icon: "🔄", title: "Devolución fácil", text: "30 días para cambios y devoluciones." },
    ],
  },
  featured: { title: "Destacados", subtitle: "Las camisetas más buscadas de la temporada", enabled: true },
  categoriesSection: { title: "Compra por categoría", subtitle: "Clubes, selecciones, retro y más", enabled: true },
  about: {
    enabled: true,
    title: "La zona donde nace la magia",
    text: "En Zone 10 vivimos el fútbol como tú. Nacimos con una idea sencilla: que cualquier jugador, desde el campo de barrio hasta el estadio, pueda vestir la camiseta de sus sueños con la mejor calidad y al mejor precio.",
    imageUrl: "/images/about.jpg",
    stats: [
      { value: "+15.000", label: "Clientes felices" },
      { value: "+300", label: "Modelos disponibles" },
      { value: "4.9/5", label: "Valoración media" },
    ],
  },
  testimonials: {
    enabled: true,
    title: "Lo que dicen nuestros jugadores",
    items: [
      { name: "Carlos M.", role: "Madrid", text: "La calidad es increíble y llegó en dos días. La personalización quedó perfecta." },
      { name: "Lucía R.", role: "Barcelona", text: "Compré para todo el equipo de mi hijo y quedaron encantados. Repetiremos." },
      { name: "Javier P.", role: "Sevilla", text: "Mejor tienda de camisetas online. Atención al cliente de 10." },
    ],
  },
  newsletter: {
    enabled: true,
    title: "Únete a la Zona",
    text: "Recibe lanzamientos, ofertas exclusivas y un 10% de descuento en tu primer pedido.",
    buttonText: "Suscribirme",
  },
  footer: {
    text: "Zone 10 es tu tienda de camisetas de fútbol de confianza. Pasión, calidad y estilo en cada equipación.",
    email: "hola@zone10.es",
    phone: "+34 600 000 000",
    address: "Calle del Fútbol 10, Madrid, España",
    instagram: "https://instagram.com/zone10",
    facebook: "https://facebook.com/zone10",
    tiktok: "https://tiktok.com/@zone10",
    youtube: "https://youtube.com/@zone10",
    copyright: "© 2025 Zone 10. Todos los derechos reservados.",
  },
  shipping: {
    freeFrom: 60,
    cost: 4.99,
    customizationPrice: 12,
    message: "Envío gratis a partir de 60€",
  },
};

export type SectionKey = keyof SiteConfig;

export async function getConfig(): Promise<SiteConfig> {
  try {
    const rows = await db.select().from(siteSettings);
    const cfg: SiteConfig = JSON.parse(JSON.stringify(defaultConfig));
    for (const row of rows) {
      const key = row.key as SectionKey;
      if (key in cfg) {
        (cfg as unknown as Record<string, unknown>)[key] = {
          ...(cfg as unknown as Record<string, object>)[key],
          ...(row.value as object),
        };
      }
    }
    return cfg;
  } catch {
    return defaultConfig;
  }
}

export async function saveSection(key: SectionKey, value: unknown) {
  await db
    .insert(siteSettings)
    .values({ key, value: value as object, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: value as object, updatedAt: new Date() },
    });
}

export async function resetSection(key: SectionKey) {
  await db.delete(siteSettings).where(eq(siteSettings.key, key));
}
