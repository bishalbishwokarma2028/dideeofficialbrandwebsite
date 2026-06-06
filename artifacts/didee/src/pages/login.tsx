import { useState, FormEvent } from "react";
import { useLocation, Link } from "wouter";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "/logo.jpg";

type Mode = "login" | "register";

export default function Login() {
  const { login, register, authenticated } = useCustomerAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authenticated) {
    navigate("/account");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    setLoading(true);
    const result = mode === "login"
      ? await login(email.trim(), password)
      : await register(email.trim(), password, name.trim(), phone.trim() || undefined);
    setLoading(false);
    if (result.ok) {
      navigate("/account");
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col">
      {/* Top bar — back to site */}
      <div className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-border/40 bg-white/60 backdrop-blur-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Website
        </Link>
        <Link href="/">
          <img
            src={logoSrc}
            alt="DIDEE"
            className="h-8 w-auto"
            style={{ filter: "invert(1)", mixBlendMode: "multiply" }}
          />
        </Link>
        <Link href="/shop" className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Shop
        </Link>
      </div>

      {/* Main form */}
      <div className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex border border-border mb-8 bg-background">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                mode === "login" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                mode === "register" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="bg-background border border-border p-6 sm:p-8 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name — register only */}
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        className="w-full border border-border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete={mode === "login" ? "email" : "email"}
                      className="w-full border border-border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Phone — register only */}
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+977-98XXXXXXXX"
                        autoComplete="tel"
                        className="w-full border border-border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "register" ? "Minimum 6 characters" : "••••••••"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      className="w-full border border-border bg-background pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                    className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A0A0A] text-white py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#C9A86A] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading
                    ? mode === "login" ? "Signing In..." : "Creating Account..."
                    : mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>

          <p className="text-center text-muted-foreground text-xs mt-6">
            {mode === "login" ? "New to DIDEE? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-[#C9A86A] font-medium hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>

          {/* Bottom home link */}
          <div className="text-center mt-8">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Return to DIDEE Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
