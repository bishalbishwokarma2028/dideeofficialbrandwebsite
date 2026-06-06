import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2, Shield, Key, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

type AdminUser = {
  id: string;
  email: string;
  role: string;
  addedAt: string;
};

export default function AdminSettings() {
  const { email: currentEmail } = useAdminAuth();

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: "1", email: currentEmail ?? "admin@didee.com", role: "Super Admin", addedAt: "Primary account" },
  ]);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminError, setAddAdminError] = useState("");
  const [addAdminSuccess, setAddAdminSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAddAdminError("");
    setAddAdminLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/users"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(prev => [...prev, { id: Date.now().toString(), email: newAdminEmail, role: "Admin", addedAt: new Date().toLocaleDateString() }]);
        setNewAdminEmail("");
        setNewAdminPassword("");
        setShowAddAdmin(false);
        setAddAdminSuccess(true);
        setTimeout(() => setAddAdminSuccess(false), 3000);
      } else {
        setAddAdminError(data.error ?? "Failed to add admin.");
      }
    } catch {
      setAddAdminError("Network error. Please try again.");
    } finally {
      setAddAdminLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/change-password"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPwSuccess(true);
        setTimeout(() => setPwSuccess(false), 3000);
      } else {
        setPwError(data.error ?? "Failed to change password.");
      }
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage admin accounts and security settings.</p>
      </div>

      {/* Admin Accounts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C9A86A]" />
            <h2 className="text-base font-semibold uppercase tracking-widest text-sm">Admin Accounts</h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-none uppercase tracking-widest text-xs flex items-center gap-2"
            onClick={() => setShowAddAdmin(v => !v)}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Admin
          </Button>
        </div>

        {addAdminSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
            Admin account added successfully.
          </motion.div>
        )}

        {/* Add admin form */}
        <AnimatePresence>
          {showAddAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <form onSubmit={handleAddAdmin} className="bg-card border border-border p-5 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest">New Admin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Email</label>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={newAdminEmail}
                      onChange={e => setNewAdminEmail(e.target.value)}
                      required
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Password</label>
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={newAdminPassword}
                      onChange={e => setNewAdminPassword(e.target.value)}
                      required
                      minLength={8}
                      className="rounded-none"
                    />
                  </div>
                </div>
                {addAdminError && <p className="text-red-500 text-xs">{addAdminError}</p>}
                <div className="flex gap-3">
                  <Button type="submit" disabled={addAdminLoading} className="rounded-none uppercase tracking-widest text-xs">
                    {addAdminLoading ? "Adding..." : "Add Admin"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowAddAdmin(false)} className="rounded-none text-xs">Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admins table */}
        <div className="bg-card border border-border divide-y divide-border">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C9A86A]/10 border border-[#C9A86A]/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#C9A86A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{admin.email}</p>
                  <p className="text-xs text-muted-foreground">{admin.role} · {admin.addedAt}</p>
                </div>
              </div>
              {admin.id !== "1" && (
                <button
                  onClick={() => setAdmins(prev => prev.filter(a => a.id !== admin.id))}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Change Password */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Key className="w-4 h-4 text-[#C9A86A]" />
          <h2 className="text-base font-semibold uppercase tracking-widest text-sm">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="bg-card border border-border p-6 space-y-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrentPw ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="rounded-none pr-10"
              />
              <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="rounded-none pr-10"
                />
                <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <Input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="rounded-none"
              />
            </div>
          </div>

          {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
          {pwSuccess && <p className="text-green-600 text-sm">Password changed successfully.</p>}

          <Button type="submit" disabled={pwLoading} className="rounded-none uppercase tracking-widest text-xs">
            {pwLoading ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </section>
    </div>
  );
}
