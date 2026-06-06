import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface CartContextType {
  sessionId: string;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let sid = sessionStorage.getItem("didee_cart_session");
    if (!sid) {
      sid = uuidv4();
      sessionStorage.setItem("didee_cart_session", sid);
    }
    setSessionId(sid);
  }, []);

  const { data: cart } = useGetCart({ sessionId }, { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } });

  const itemCount = cart?.itemCount || 0;

  return (
    <CartContext.Provider value={{ sessionId, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
