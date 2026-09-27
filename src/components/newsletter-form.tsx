"use client";

import { useState } from "react";

export function NewsletterForm({ buttonText }: { buttonText: string }) {
  const [done, setDone] = useState(false);
  if (done) return <p className="mt-6 text-green-600 font-semibold">¡Gracias! Ya formas parte de la Zona. 🎉</p>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="mt-6 flex gap-2 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        placeholder="tu@email.com"
        className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)]"
      />
      <button className="bg-[var(--primary)] text-white px-6 rounded-xl font-semibold hover:opacity-90">{buttonText}</button>
    </form>
  );
}
