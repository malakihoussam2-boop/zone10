"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
          if (r.ok) router.refresh();
          else setErr("Contraseña incorrecta");
        }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center gap-2 font-black text-2xl mb-1">
          <span className="w-9 h-9 rounded-lg bg-lime-400 flex items-center justify-center">10</span> ZONE 10
        </div>
        <p className="text-slate-500 text-sm mb-6">Panel de administración</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Contraseña"
          className="w-full border rounded-xl px-4 py-3 mb-3 outline-none focus:border-slate-900"
        />
        {err && <p className="text-red-500 text-sm mb-3">{err}</p>}
        <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Entrar</button>
        <p className="text-xs text-slate-400 mt-4 text-center">Contraseña por defecto: <code>zone10admin</code></p>
      </form>
    </div>
  );
}
