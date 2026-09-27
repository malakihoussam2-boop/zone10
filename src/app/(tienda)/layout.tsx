import type { ReactNode } from "react";
import { getConfig } from "@/lib/settings";
import { getCategories } from "@/lib/queries";
import { CartProvider } from "@/components/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const [config, categories] = await Promise.all([getConfig(), getCategories()]);
  const style = {
    "--primary": config.general.primaryColor,
    "--accent": config.general.accentColor,
  } as React.CSSProperties;
  return (
    <CartProvider>
      <div style={style} className="min-h-screen flex flex-col">
        <Header config={config} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer config={config} categories={categories} />
        <CartDrawer currency={config.general.currency} freeFrom={config.shipping.freeFrom} />
      </div>
    </CartProvider>
  );
}
