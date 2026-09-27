import Link from "next/link";
import { getConfig } from "@/lib/settings";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";

export default async function HomePage() {
  const [config, categories, featured] = await Promise.all([
    getConfig(),
    getCategories(),
    getProducts({ featured: true }),
  ]);
  const cur = config.general.currency;

  return (
    <>
      {/* HERO */}
      <section className="relative bg-[var(--primary)] text-white overflow-hidden">
        <div className="absolute inset-0">
          {config.hero.imageUrl && (
            <img src={config.hero.imageUrl} alt="" className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-28 md:py-40">
          <div className="max-w-2xl">
            {config.hero.badge && (
              <span className="inline-block bg-[var(--accent)] text-slate-900 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-wider">
                {config.hero.badge}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black leading-tight">{config.hero.title}</h1>
            <p className="mt-5 text-lg text-white/80">{config.hero.subtitle}</p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link
                href={config.hero.buttonLink || "/productos"}
                className="bg-[var(--accent)] text-slate-900 font-bold px-7 py-3.5 rounded-xl hover:brightness-110 transition"
              >
                {config.hero.buttonText}
              </Link>
              <Link href="/#nosotros" className="border border-white/40 px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition">
                Conócenos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 -mt-10 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.features.items.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
              <div className="text-3xl">{f.icon}</div>
              <p className="font-bold mt-2">{f.title}</p>
              <p className="text-sm text-slate-500 mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {config.categoriesSection.enabled && (
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black">{config.categoriesSection.title}</h2>
            <p className="text-slate-500 mt-2">{config.categoriesSection.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/productos?categoria=${c.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800"
              >
                {c.imageUrl && (
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-60 transition duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="text-xl font-bold">{c.name}</p>
                  <p className="text-sm text-white/70">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      {config.featured.enabled && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black">{config.featured.title}</h2>
                <p className="text-slate-500 mt-2">{config.featured.subtitle}</p>
              </div>
              <Link href="/productos" className="font-semibold underline underline-offset-4 hover:text-[var(--accent)]">
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} currency={cur} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {config.about.enabled && (
        <section id="nosotros" className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200">
            {config.about.imageUrl && <img src={config.about.imageUrl} alt="" className="w-full h-full object-cover" />}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black">{config.about.title}</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">{config.about.text}</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {config.about.stats.map((s, i) => (
                <div key={i}>
                  <p className="text-2xl md:text-3xl font-black text-[var(--primary)]">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {config.testimonials.enabled && (
        <section className="bg-[var(--primary)] text-white py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12">{config.testimonials.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {config.testimonials.items.map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-[var(--accent)] mb-3">★★★★★</div>
                  <p className="text-white/90">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-4 font-bold">{t.name}</p>
                  <p className="text-xs text-white/60">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      {config.newsletter.enabled && (
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-black">{config.newsletter.title}</h2>
          <p className="text-slate-500 mt-3">{config.newsletter.text}</p>
          <NewsletterForm buttonText={config.newsletter.buttonText} />
        </section>
      )}
    </>
  );
}
