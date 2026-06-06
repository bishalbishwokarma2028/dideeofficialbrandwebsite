import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AdminAuthState = {
  loading: boolean;
  authenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          setEmail(data.email);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(emailInput: string, password: string) {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthenticated(true);
        setEmail(data.email);
        return { ok: true };
      }
      return { ok: false, error: data.error ?? "Login failed" };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
    setEmail(null);
  }

  return (
    <AdminAuthContext.Provider value={{ loading, authenticated, email, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
