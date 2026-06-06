import { useState } from "react";
import { useListCollections } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiUrl, adminFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type CollectionForm = {
  name: string;
  slug: string;
  description: string;
  season: string;
  image: string;
  featured: boolean;
};

const EMPTY_FORM: CollectionForm = {
  name: "",
  slug: "",
  description: "",
  season: "",
  image: "",
  featured: false,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminCollections() {
  const { data: collections, isLoading, refetch } = useListCollections();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CollectionForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function handleNameChange(name: string) {
    setForm(f => ({ ...f, name, slug: slugify(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch(apiUrl("/api/collections"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || null,
          season: form.season.trim() || null,
          image: form.image.trim() || null,
          featured: form.featured,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setForm(EMPTY_FORM);
        refetch();
      } else {
        setError(data.error ?? "Failed to create collection.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = collections?.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Collections</h1>
        <Button
          className="rounded-none tracking-widest uppercase text-sm flex items-center gap-2"
          onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setError(""); }}
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              className="pl-9 rounded-none border-border"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading collections...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-bg text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Collection</th>
                  <th className="px-6 py-4 font-medium">Season</th>
                  <th className="px-6 py-4 font-medium">Products</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered?.map((collection) => (
                  <tr key={collection.id} className="hover:bg-neutral-bg/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-bg shrink-0">
                        <img src={collection.image || "/images/collection-casual.png"} alt={collection.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{collection.name}</span>
                        <p className="text-xs text-muted-foreground">{collection.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {collection.season || "-"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {collection.productCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded-sm ${
                        collection.featured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {collection.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!filtered || filtered.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      {search ? "No collections match your search." : "No collections yet. Create your first one."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Collection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-serif">New Collection</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Collection Name *</label>
                  <Input
                    placeholder="e.g. Summer Essentials"
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    required
                    className="rounded-none"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Slug *</label>
                  <Input
                    placeholder="e.g. summer-essentials"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                    required
                    className="rounded-none font-mono text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">URL: /collections/{form.slug || "…"}</p>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Season</label>
                  <Input
                    placeholder="e.g. SS25, AW24"
                    value={form.season}
                    onChange={e => setForm(f => ({ ...f, season: e.target.value }))}
                    className="rounded-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Description</label>
                  <textarea
                    placeholder="Brief description of this collection..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none transition-colors"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Cover Image URL</label>
                  <Input
                    placeholder="https://… or /images/…"
                    value={form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    className="rounded-none"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#C9A86A]"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Feature this collection on the homepage</label>
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="rounded-none uppercase tracking-widest text-xs flex-1">
                    {saving ? "Creating…" : "Create Collection"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-none uppercase tracking-widest text-xs">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
