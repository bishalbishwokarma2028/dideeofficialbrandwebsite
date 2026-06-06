import { useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type LookbookItem = {
  id: string;
  src: string;
  caption: string;
  category: string;
};

const DEFAULT_ITEMS: LookbookItem[] = [
  { id: "1", src: "/images/brand-freshjuice.png",  caption: "Fresh Drop",    category: "Campaign" },
  { id: "2", src: "/images/brand-street-day.png",  caption: "Street Soul",   category: "Street" },
  { id: "3", src: "/images/brand-goldpalace.png",  caption: "Bold Moves",    category: "Campaign" },
  { id: "4", src: "/images/brand-stairs.png",      caption: "Dark Edge",     category: "Editorial" },
  { id: "5", src: "/images/brand-night.png",       caption: "Night Route",   category: "Night" },
  { id: "6", src: "/images/brand-hotpot.png",      caption: "Raw Energy",    category: "Street" },
  { id: "7", src: "/images/brand-guys.png",        caption: "Graphic Soul",  category: "Campaign" },
];

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function AdminLookbook() {
  const [items, setItems] = useState<LookbookItem[]>(DEFAULT_ITEMS);
  const [showAdd, setShowAdd] = useState(false);
  const [newSrc, setNewSrc] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("Campaign");
  const [preview, setPreview] = useState<LookbookItem | null>(null);
  const [saved, setSaved] = useState(false);

  function handleAdd() {
    if (!newSrc.trim()) return;
    setItems(prev => [
      { id: uid(), src: newSrc.trim(), caption: newCaption.trim() || "Untitled", category: newCategory },
      ...prev,
    ]);
    setNewSrc("");
    setNewCaption("");
    setNewCategory("Campaign");
    setShowAdd(false);
  }

  function handleRemove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const CATEGORIES = ["Campaign", "Street", "Editorial", "Night", "Studio", "Events"];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-1">Lookbook</h1>
          <p className="text-muted-foreground text-sm">{items.length} images in the gallery</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-none tracking-widest uppercase text-xs"
            onClick={handleSave}
          >
            {saved ? "Saved!" : "Save Changes"}
          </Button>
          <Button
            className="rounded-none tracking-widest uppercase text-sm flex items-center gap-2"
            onClick={() => setShowAdd(v => !v)}
          >
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card border border-border p-6 space-y-4">
              <h3 className="font-semibold text-sm tracking-widest uppercase">Add New Image</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Image URL *</label>
                  <Input
                    placeholder="https://example.com/image.jpg or /images/photo.png"
                    value={newSrc}
                    onChange={e => setNewSrc(e.target.value)}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full h-10 border border-border bg-background px-3 text-sm focus:outline-none focus:border-foreground"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">Caption</label>
                  <Input
                    placeholder="e.g. Fresh Drop, Night Route..."
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    className="rounded-none"
                  />
                </div>
              </div>
              {newSrc && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Preview</p>
                  <img src={newSrc} alt="Preview" className="h-32 w-auto object-cover border border-border" onError={e => (e.currentTarget.style.display = "none")} />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleAdd} className="rounded-none uppercase tracking-widest text-xs">Add to Lookbook</Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)} className="rounded-none text-xs">Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="group relative bg-neutral-bg border border-border overflow-hidden"
          >
            <div className="aspect-[3/4] overflow-hidden">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="hidden w-full h-full items-center justify-center bg-neutral-bg">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
            </div>

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <button
                onClick={() => setPreview(item)}
                className="w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                title="Preview"
              >
                <Eye className="w-4 h-4 text-black" />
              </button>
              <button
                onClick={() => handleRemove(item.id)}
                className="w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-2.5 border-t border-border bg-card">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{item.caption}</p>
                  <p className="text-[10px] text-muted-foreground">{item.category}</p>
                </div>
                <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5 cursor-grab" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No images in the lookbook yet.</p>
          <Button className="mt-4 rounded-none uppercase tracking-widest text-xs" onClick={() => setShowAdd(true)}>
            Add First Image
          </Button>
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full bg-card border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <img src={preview.src} alt={preview.caption} className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{preview.caption}</p>
                  <p className="text-sm text-muted-foreground">{preview.category}</p>
                </div>
                <Button variant="ghost" onClick={() => setPreview(null)} className="rounded-none text-xs uppercase tracking-widest">Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
