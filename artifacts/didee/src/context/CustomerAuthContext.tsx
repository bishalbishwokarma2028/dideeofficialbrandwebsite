import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiUrl, authedFetch, setUserToken, clearUserToken, getUserToken } from "@/lib/api";

type UserData = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
};

type CustomerAuthState = {
  loading: boolean;
  authenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>;
};

const CustomerAuthContext = createContext<CustomerAuthState | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    authedFetch(apiUrl("/api/auth/me"))
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) setUserToken(data.token);
        setAuthenticated(true);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error ?? "Login failed" };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  async function register(email: string, password: string, name: string, phone?: string) {
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) setUserToken(data.token);
        setAuthenticated(true);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error ?? "Registration failed" };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  async function logout() {
    clearUserToken();
    await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
    setAuthenticated(false);
    setUser(null);
  }

  async function updateProfile(data: { name?: string; phone?: string }) {
    try {
      const res = await authedFetch(apiUrl("/api/auth/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        if (json.token) setUserToken(json.token);
        setUser(json.user);
        return { ok: true };
      }
      return { ok: false, error: json.error ?? "Update failed" };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  return (
    <CustomerAuthContext.Provider value={{ loading, authenticated, user, login, register, logout, updateProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  return ctx;
}
