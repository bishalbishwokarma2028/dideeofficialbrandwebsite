import { useState } from "react";
import { useListCategories } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Tag, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryForm = { name: string; parentSlug: string };
const emptyForm: CategoryForm = { name: "", parentSlug: "" };

const SUGGESTED_CATEGORIES = [
  { name: "New Arrivals", parent: "" },
  { name: "Tops", parent: "" },
  { name: "Bottoms", parent: "" },
  { name: "Dresses", parent: "" },
  { name: "Outerwear", parent: "" },
  { name: "Accessories", parent: "" },
  { name: "Streetwear", parent: "" },
  { name: "Casual Essentials", parent: "" },
  { name: "Graphic Tees", parent: "Tops" },
  { name: "Crop Tops", parent: "Tops" },
  { name: "Plaid Skirts", parent: "Bottoms" },
  { name: "Wide Leg Denim", parent: "Bottoms" },
  { name: "Mini Skirts", parent: "Bottoms" },
  { name: "Cargo Pants", parent: "Bottoms" },
  { name: "Belts", parent: "Accessories" },
  { name: "Chains & Jewelry", parent: "Accessories" },
  { name: "Caps & Hats", parent: "Accessories" },
  { name: "Bags", parent: "Accessories" },
  { name: "Limited Edition", parent: "" },
  { name: "Sale", parent: "" },
  { name: "Dark Aesthetic", parent: "Streetwear" },
  { name: "Alternative Fashion", parent: "Streetwear" },
];

export default function AdminCategories() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [quickSaving, setQuickSaving] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useListCategories();

  async function handleSave() {
    if (!form.name.trim()) { setError("Category name is required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: form.name.trim(), parentSlug: form.parentSlug || undefined }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to save"); }
      await queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setModal(false);
      setForm(emptyForm);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function quickAdd(suggestion: typeof SUGGESTED_CATEGORIES[0]) {
    setQuickSaving(suggestion.name);
    try {
      const parentSlug = suggestion.parent
        ? categories?.find(c => c.name === suggestion.parent)?.slug
        : undefined;
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: suggestion.name, parentSlug }),
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    } catch {}
    setQuickSaving(null);
  }

  async function handleDelete(slug: string) {
    try {
      await fetch(`/api/categories/${slug}`, { method: "DELETE", credentials: "include" });
      await queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    } catch {}
    setDeleteConfirm(null);
  }

  const parentCategories = categories?.filter(c => !c.parentSlug) ?? [];
  const existingNames = new Set(categories?.map(c => c.name.toLowerCase()) ?? []);

  const availableSuggestions = SUGGESTED_CATEGORIES.filter(s => !existingNames.has(s.name.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage product categories for your store</p>
        </div>
        <Button onClick={() => { setModal(true); setForm(emptyForm); setError(""); }} className="rounded-none gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Categories</p>
          <p className="text-3xl font-bold">{categories?.length ?? 0}</p>
        </div>
        <div className="bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Parent Categories</p>
          <p className="text-3xl font-bold">{parentCategories.length}</p>
        </div>
        <div className="bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Sub-Categories</p>
          <p className="text-3xl font-bold">{(categories?.filter(c => c.parentSlug) ?? []).length}</p>
        </div>
      </div>

      {/* Quick Add Suggestions */}
      {availableSuggestions.length > 0 && (
        <div className="bg-card border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#C9A86A]" />
            <p className="text-xs font-black tracking-[0.2em] uppercase text-foreground">Quick Add — DIDEE Brand Categories</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Click any category below to instantly add it to your store:</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map(s => (
              <button
                key={s.name}
                onClick={() => quickAdd(s)}
                disabled={quickSaving === s.name}
                className={`group flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold tracking-wide transition-all duration-200
                  ${quickSaving === s.name
                    ? "border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A]"
                    : "border-border hover:border-[#C9A86A] hover:bg-[#C9A86A]/8 hover:text-[#C9A86A] text-muted-foreground"
                  }`}
              >
                <Plus className="w-3 h-3" />
                {s.name}
                {s.parent && <span className="text-[10px] opacity-50">↳{s.parent}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="bg-card border border-border shadow-sm">
        <div className="p-4 border-b border-border">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">All Categories</p>
        </div>
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Loading categories...</div>
        ) : !categories?.length ? (
          <div className="p-12 text-center">
            <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No categories yet. Use Quick Add above or create your own.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {parentCategories.map((cat) => {
              const children = categories.filter(c => c.parentSlug === cat.slug);
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 flex items-center justify-center text-primary rounded-sm">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">/{cat.slug} · {children.length} sub-categories</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setModal(true); setForm({ name: "", parentSlug: cat.slug }); setError(""); }}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border hover:border-foreground transition-colors font-bold tracking-wide"
                      >
                        + Sub
                      </button>
                      <button onClick={() => setDeleteConfirm(cat.slug)} className="text-destructive hover:text-red-700 p-1.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {children.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between pl-16 pr-6 py-3 hover:bg-neutral-50 transition-colors group border-t border-border/50">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">↳ {sub.name}</p>
                        <p className="text-xs text-muted-foreground/60">/{sub.slug}</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(sub.slug)}
                        className="text-destructive hover:text-red-700 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-background w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-serif text-xl">Add Category</h2>
                <button onClick={() => setModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                {error && <p className="text-destructive text-sm bg-red-50 px-4 py-3 border border-destructive/20">{error}</p>}

                <div>
                  <label className="text-xs font-black tracking-widest uppercase block mb-2">Category Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Tops, Bottoms, Accessories..."
                    className="rounded-none"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                  />
                </div>

                <div>
                  <label className="text-xs font-black tracking-widest uppercase block mb-2">Parent Category (optional)</label>
                  <select
                    value={form.parentSlug}
                    onChange={(e) => setForm(f => ({ ...f, parentSlug: e.target.value }))}
                    className="w-full border border-border bg-background p-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">— None (top-level) —</option>
                    {parentCategories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1.5">Leave blank to make this a top-level category</p>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-none">
                    {saving ? "Saving..." : "Add Category"}
                  </Button>
                  <Button variant="outline" onClick={() => setModal(false)} className="rounded-none">Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background w-full max-w-sm shadow-xl p-6">
              <h3 className="font-bold text-lg mb-2">Delete Category?</h3>
              <p className="text-muted-foreground text-sm mb-6">This will remove the category. Products using it will need to be reassigned.</p>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)} className="rounded-none flex-1">Delete</Button>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-none">Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
