"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const input = "w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] bg-white";
  if (sent) return <div className="bg-green-50 text-green-700 rounded-2xl p-8 font-semibold">¡Mensaje enviado! Te responderemos en menos de 24h.</div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <input required placeholder="Nombre" className={input} />
      <input required type="email" placeholder="Email" className={input} />
      <textarea required rows={5} placeholder="Mensaje" className={input} />
      <button className="w-full bg-[var(--primary)] text-white py-3.5 rounded-xl font-bold hover:opacity-90">Enviar mensaje</button>
    </form>
  );
}
