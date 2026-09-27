import { getConfig } from "@/lib/settings";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage() {
  const config = await getConfig();
  const f = config.footer;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-black">Contacto</h1>
        <p className="text-slate-500 mt-3">¿Tienes dudas sobre tallas, pedidos o personalización? Escríbenos.</p>
        <ul className="mt-8 space-y-3 text-slate-700">
          <li>📧 {f.email}</li>
          <li>📞 {f.phone}</li>
          <li>📍 {f.address}</li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
