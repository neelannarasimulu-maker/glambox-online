"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type CartItem = {
  itemKey: string;
  popupKey: string;
  productId: string;
  name: string;
  price: number;
  priceLabel: string;
  image: { src: string; alt: string };
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  removeItem: (itemKey: string) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
  completeOrder: () => void;
  lastOrder: CartItem[];
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "glambox_cart";
const LAST_ORDER_KEY = "glambox_last_order";

const parsePrice = (value: string) => {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const storedOrder = window.localStorage.getItem(LAST_ORDER_KEY);
    if (stored) {
      const parsed: CartItem[] = JSON.parse(stored);
      const migrated = parsed.map((entry) => ({
        ...entry,
        itemKey: entry.itemKey ?? `${entry.popupKey}:${entry.productId}`
      }));
      setItems(migrated);
    }
    if (storedOrder) {
      const parsedOrder: CartItem[] = JSON.parse(storedOrder);
      const migratedOrder = parsedOrder.map((entry) => ({
        ...entry,
        itemKey: entry.itemKey ?? `${entry.popupKey}:${entry.productId}`
      }));
      setLastOrder(migratedOrder);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.itemKey === item.itemKey);
      if (existing) {
        return prev.map((entry) =>
          entry.itemKey === item.itemKey
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (itemKey: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((entry) =>
          entry.itemKey === itemKey ? { ...entry, quantity } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const removeItem = (itemKey: string) => {
    setItems((prev) => prev.filter((entry) => entry.itemKey !== itemKey));
  };

  const clear = () => {
    setItems([]);
  };

  const completeOrder = () => {
    setLastOrder(items);
    window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(items));
    clear();
  };

  const subtotal = useMemo(
    () => items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0),
    [items]
  );
  const itemCount = useMemo(
    () => items.reduce((sum, entry) => sum + entry.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      subtotal,
      itemCount,
      completeOrder,
      lastOrder
    }),
    [items, subtotal, itemCount, lastOrder]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function priceLabel(value: number, fallback = "R") {
  return `${fallback}${value.toFixed(0)}`;
}

export function normalizeProductPrice(price: string) {
  return parsePrice(price);
}
