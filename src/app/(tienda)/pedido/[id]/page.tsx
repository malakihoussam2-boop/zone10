import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderWithItems, formatPrice } from "@/lib/queries";
import { getConfig } from "@/lib/settings";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, config] = await Promise.all([getOrderWithItems(Number(id)), getConfig()]);
  if (!order) notFound();
  const cur = config.general.currency;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-black">¡Gracias por tu pedido, {order.customerName.split(" ")[0]}!</h1>
      <p className="text-slate-500 mt-3">
        Tu pedido <strong>#{order.id}</strong> ha sido recibido. Te hemos enviado un email de confirmación a {order.email}.
      </p>
      <div className="bg-white border rounded-2xl p-6 mt-8 text-left text-sm">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between py-2 border-b last:border-0">
            <span>
              {i.quantity}× {i.productName} <span className="text-slate-500">({i.size}{i.customName ? `, ${i.customName} ${i.customNumber}` : ""})</span>
            </span>
            <span className="font-semibold">{formatPrice(parseFloat(i.unitPrice) * i.quantity, cur)}</span>
          </div>
        ))}
        <div className="flex justify-between font-black text-lg pt-4">
          <span>Total</span>
          <span>{formatPrice(order.total, cur)}</span>
        </div>
        <p className="text-slate-500 mt-4">Envío a: {order.address}, {order.postalCode} {order.city}</p>
      </div>
      <Link href="/productos" className="inline-block mt-8 bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold">
        Seguir comprando
      </Link>
    </div>
  );
}
