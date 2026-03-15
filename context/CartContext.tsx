'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const CART_STORAGE_KEY = 'eiliyah-cart';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'bundle';
};

type CartPayload = { id: string; name: string; price: number };

type CartContextType = {
  items: CartItem[];
  total: number;
  addProduct: (product: CartPayload) => void;
  addBundle: (bundle: CartPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback(
    (payload: CartPayload, type: 'product' | 'bundle') => {
      const id = `${type}-${payload.id}`;
      setItems((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [
          ...prev,
          { id, name: payload.name, price: payload.price, quantity: 1, type }
        ];
      });
    },
    []
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addProduct(product) {
        addItem(product, 'product');
      },
      addBundle(bundle) {
        addItem(bundle, 'bundle');
      },
      removeItem(id) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      },
      updateQuantity(id, quantity) {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((i) => i.id !== id));
          return;
        }
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
      },
      clear() {
        setItems([]);
      }
    }),
    [items, addItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
