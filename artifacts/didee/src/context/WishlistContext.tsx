import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type WishlistItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  isNew?: boolean;
};

type WishlistContextType = {
  items: WishlistItem[];
  itemCount: number;
  isWishlisted: (id: number) => boolean;
  toggle: (product: WishlistItem) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "didee_wishlist";

function load(): WishlistItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}

function save(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(load);

  const isWishlisted = useCallback((id: number) => items.some(i => i.id === id), [items]);

  const toggle = useCallback((product: WishlistItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === product.id);
      const next = exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems(prev => { const next = prev.filter(i => i.id !== id); save(next); return next; });
  }, []);

  const clear = useCallback(() => { setItems([]); localStorage.removeItem(STORAGE_KEY); }, []);

  return (
    <WishlistContext.Provider value={{ items, itemCount: items.length, isWishlisted, toggle, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
