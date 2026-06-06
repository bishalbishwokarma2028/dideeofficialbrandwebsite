import { useState, useRef } from "react";
import { useListProducts, useListCategories, useGetFeaturedCollections } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListProductsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, X, Upload, ImagePlus, ToggleLeft, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "@/lib/api";

type ProductForm = {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  collectionSlug: string;
  categorySlug: string;
  status: "active" | "draft";
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  images: string[];
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  shortDescription: "",
  price: "",
  comparePrice: "",
  collectionSlug: "",
  categorySlug: "",
  status: "active",
  featured: false,
  isNew: true,
  isBestSeller: false,
  images: [],
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<{ open: boolean; mode: "create" | "edit"; slug?: string }>({ open: false, mode: "create" });
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useListProducts({ limit: 50 });
  const { data: categories } = useListCategories();
  const { data: collections } = useGetFeaturedCollections();

  const filtered = productsData?.products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  }) ?? [];

  function openCreate() {
    setForm(emptyForm);
    setImageUrl("");
    setError("");
    setModal({ open: true, mode: "create" });
  }

  function openEdit(product: any) {
    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      shortDescription: product.shortDescription ?? "",
      price: String(product.price ?? ""),
      comparePrice: product.comparePrice ? String(product.comparePrice) : "",
      collectionSlug: product.collectionSlug ?? "",
      categorySlug: product.categorySlug ?? "",
      status: product.status ?? "active",
      featured: product.featured ?? false,
      isNew: product.isNew ?? false,
      isBestSeller: product.isBestSeller ?? false,
      images: product.images ?? [],
    });
    setImageUrl("");
    setError("");
    setModal({ open: true, mode: "edit", slug: product.slug });
  }

  function closeModal() {
    setModal({ open: false, mode: "create" });
    setError("");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(apiUrl("/api/upload"), {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errData.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    } catch (err: any) {
      setError("Image upload failed: " + (err.message ?? "Unknown error"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageUrl("");
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { setError("A valid price is required."); return; }
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        shortDescription: form.shortDescription.trim() || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        collectionSlug: form.collectionSlug || undefined,
        categorySlug: form.categorySlug || undefined,
        status: form.status,
        featured: form.featured,
        isNew: form.isNew,
        isBestSeller: form.isBestSeller,
        images: form.images,
      };

      const url = modal.mode === "create" ? apiUrl("/api/products") : apiUrl(`/api/products/${modal.slug}`);
      const method = modal.mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      await queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    try {
      await fetch(apiUrl(`/api/products/${slug}`), { method: "DELETE" });
      await queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 text-sm px-3 py-2 border transition-colors ${
        value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground"
      }`}
    >
      {value ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openCreate} className="rounded-none tracking-widest uppercase text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border shadow-sm mb-0">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-none border-border"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border bg-transparent p-2 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-bg text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-neutral-bg shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImagePlus className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                          <div className="flex gap-2 mt-1">
                            {product.featured && <span className="text-[10px] bg-[#C9A86A]/10 text-[#C9A86A] px-1.5 py-0.5 font-medium uppercase tracking-wider">Featured</span>}
                            {product.isNew && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 font-medium uppercase tracking-wider">New</span>}
                            {product.isBestSeller && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 font-medium uppercase tracking-wider">Best Seller</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{product.categorySlug ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded-sm ${
                        product.status === "active" ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.totalStock ?? 0}</td>
                    <td className="px-6 py-4 font-medium">NPR {product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(product.slug)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-background border border-border p-8 max-w-sm w-full text-center shadow-2xl">
              <h3 className="font-serif text-xl mb-3">Delete Product?</h3>
              <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-none px-6">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)} className="rounded-none px-6">Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative bg-background border-l border-border w-full max-w-2xl h-full overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-background border-b border-border flex items-center justify-between px-8 py-5 z-10">
                <h2 className="font-serif text-2xl">
                  {modal.mode === "create" ? "Add New Product" : "Edit Product"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-neutral-bg rounded-sm transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 py-6 space-y-8">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
                    {error}
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground pb-2 border-b border-border">Basic Information</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. DIDEE Classic Logo Tee"
                      className="rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description</label>
                    <Input
                      value={form.shortDescription}
                      onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                      placeholder="One-line product summary..."
                      className="rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Detailed product description, materials, fit notes..."
                      rows={5}
                      className="w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground pb-2 border-b border-border">Pricing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (NPR) *</label>
                      <Input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        placeholder="1299"
                        className="rounded-none"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Compare Price (NPR)</label>
                      <Input
                        type="number"
                        value={form.comparePrice}
                        onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
                        placeholder="1999 (optional)"
                        className="rounded-none"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground pb-2 border-b border-border">Product Images</h3>

                  {/* Existing images */}
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover border border-border" />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 uppercase tracking-wider">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload file */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-border hover:border-foreground py-8 flex flex-col items-center gap-3 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        {uploading ? "Uploading..." : "Click to upload image"}
                      </span>
                      <span className="text-xs">JPEG, PNG, WebP up to 10MB</span>
                    </button>
                  </div>

                  {/* Or paste URL */}
                  <div className="flex gap-2">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addImageUrl()}
                      placeholder="Or paste image URL..."
                      className="rounded-none flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addImageUrl} className="rounded-none px-4">
                      Add
                    </Button>
                  </div>
                </div>

                {/* Categorisation */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground pb-2 border-b border-border">Categorisation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Collection</label>
                      <select
                        value={form.collectionSlug}
                        onChange={(e) => setForm((f) => ({ ...f, collectionSlug: e.target.value }))}
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">None</option>
                        {collections?.map((col) => (
                          <option key={col.id} value={col.slug}>{col.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={form.categorySlug}
                        onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">None</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status & Flags */}
                <div className="space-y-5">
                  <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground pb-2 border-b border-border">Status & Visibility</h3>
                  <div>
                    <label className="block text-sm font-medium mb-3">Product Status</label>
                    <div className="flex gap-3">
                      {(["active", "draft"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, status: s }))}
                          className={`px-5 py-2.5 text-sm font-medium border transition-colors capitalize ${
                            form.status === s
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Labels</label>
                    <div className="flex flex-wrap gap-3">
                      <Toggle value={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Featured" />
                      <Toggle value={form.isNew} onChange={(v) => setForm((f) => ({ ...f, isNew: v }))} label="New Arrival" />
                      <Toggle value={form.isBestSeller} onChange={(v) => setForm((f) => ({ ...f, isBestSeller: v }))} label="Best Seller" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-background border-t border-border px-8 py-5 flex justify-between items-center gap-4">
                <Button variant="outline" onClick={closeModal} className="rounded-none px-6">Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="rounded-none px-10 tracking-widest uppercase text-sm">
                  {saving ? "Saving..." : modal.mode === "create" ? "Create Product" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
