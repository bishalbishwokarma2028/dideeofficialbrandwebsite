import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { login, authenticated } = useAdminAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authenticated) {
    navigate("/admin");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.ok) {
      navigate("/admin");
    } else {
      setError(result.error ?? "Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-semibold tracking-[0.2em] text-white mb-2">
            DIDEE
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 font-medium">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
          <h2 className="text-white font-medium text-lg mb-1">Sign In</h2>
          <p className="text-white/40 text-sm mb-8">Enter your admin credentials to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase text-white/60 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase text-white/60 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A86A] text-black py-3.5 text-sm font-medium tracking-[0.15em] uppercase hover:bg-[#b8973a] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing In..." : "Sign In to Admin"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} DIDEE. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
