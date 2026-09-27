import { getConfig } from "@/lib/settings";
import { CheckoutForm } from "@/components/checkout-form";

export default async function CheckoutPage() {
  const config = await getConfig();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black mb-8">Finalizar compra</h1>
      <CheckoutForm currency={config.general.currency} shipping={config.shipping} />
    </div>
  );
}
