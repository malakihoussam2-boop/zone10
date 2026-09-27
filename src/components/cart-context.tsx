"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  key: string;
  productId: number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  size: string;
  customName: string;
  customNumber: string;
  customizationPrice: number;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "key">) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("zone10_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("zone10_cart", JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (item) => {
      const key = `${item.productId}-${item.size}-${item.customName}-${item.customNumber}`;
      setItems((prev) => {
        const ex = prev.find((i) => i.key === key);
        if (ex) return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i));
        return [...prev, { ...item, key }];
      });
      setOpen(true);
    };
    return {
      items,
      add,
      remove: (key) => setItems((p) => p.filter((i) => i.key !== key)),
      setQty: (key, qty) =>
        setItems((p) => p.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, qty) } : i))),
      clear: () => setItems([]),
      count: items.reduce((a, i) => a + i.quantity, 0),
      subtotal: items.reduce((a, i) => a + (i.price + i.customizationPrice) * i.quantity, 0),
      open,
      setOpen,
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
