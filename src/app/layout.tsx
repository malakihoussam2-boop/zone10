import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zone 10 · Camisetas de fútbol",
  description: "Tienda online de camisetas de fútbol para auténticos jugadores. Clubes, selecciones, retro y personalización.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
