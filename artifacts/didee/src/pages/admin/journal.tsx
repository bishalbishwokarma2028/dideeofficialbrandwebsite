import { useState } from "react";
import { useListJournalPosts } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, X, Eye, EyeOff, Trash2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PostForm = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  coverImage: string;
  published: boolean;
};

const emptyForm: PostForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "DIDEE Editorial",
  category: "",
  coverImage: "",
  published: false,
};

const JOURNAL_CATEGORIES = [
  "Style Tips", "Brand Story", "New Arrivals", "Behind the Scenes",
  "Lookbook", "Street Style", "Fashion Trends", "Nepal Fashion",
  "Sustainability", "Collaborations",
];

export default function AdminJournal() {
  const { data: posts, isLoading } = useListJournalPosts();
  const queryClient = useQueryClient();

  const [modal, setModal] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  function openCreate() {
    setEditPost(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  }

  function openEdit(post: any) {
    setEditPost(post);
    setForm({
      title: post.title ?? "",
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      author: post.author ?? "DIDEE Editorial",
      category: post.category ?? "",
      coverImage: post.coverImage ?? "",
      published: post.published ?? false,
    });
    setError("");
    setModal(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true); setError("");
    try {
      const url = editPost ? `/api/journal/${editPost.id}` : "/api/journal";
      const method = editPost ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          excerpt: form.excerpt.trim() || undefined,
          content: form.content.trim() || undefined,
          author: form.author.trim() || "DIDEE Editorial",
          category: form.category.trim() || undefined,
          coverImage: form.coverImage.trim() || undefined,
          published: form.published,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save post");
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      setModal(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE", credentials: "include" });
      await queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
    } catch {}
    setDeleteConfirm(null);
  }

  async function togglePublished(post: any) {
    try {
      await fetch(`/api/journal/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ published: !post.published }),
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
    } catch {}
  }

  const filtered = posts?.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif">Journal Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your editorial content and brand stories</p>
        </div>
        <Button onClick={openCreate} className="rounded-none tracking-widest uppercase text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Posts</p>
          <p className="text-3xl font-bold">{posts?.length ?? 0}</p>
        </div>
        <div className="bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Published</p>
          <p className="text-3xl font-bold">{posts?.filter(p => p.published).length ?? 0}</p>
        </div>
        <div className="bg-card border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Drafts</p>
          <p className="text-3xl font-bold">{posts?.filter(p => !p.published).length ?? 0}</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-9 rounded-none border-border"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Post Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-neutral-100 shrink-0 overflow-hidden">
                          {post.coverImage
                            ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><FileText className="w-5 h-5 text-muted-foreground/40" /></div>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                          {post.excerpt && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{post.category || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{post.author || "Editorial"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded-sm transition-colors ${
                          post.published
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-muted text-muted-foreground hover:bg-neutral-200"
                        }`}
                      >
                        {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-red-700" onClick={() => setDeleteConfirm(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        {search ? "No posts match your search." : "No posts yet. Create your first journal post."}
                      </p>
                      {!search && (
                        <button onClick={openCreate} className="mt-4 text-xs font-bold text-[#C9A86A] hover:underline">+ Create Post</button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-background w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
                <h2 className="font-serif text-xl">{editPost ? "Edit Post" : "New Journal Post"}</h2>
                <button onClick={() => setModal(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                {error && <p className="text-destructive text-sm bg-red-50 px-4 py-3 border border-destructive/20">{error}</p>}

                <div>
                  <label className="text-xs font-black tracking-widest uppercase block mb-2">Title *</label>
                  <Input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Enter post title..."
                    className="rounded-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-black tracking-widest uppercase block mb-2">Excerpt</label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    placeholder="Short description shown in listings..."
                    rows={2}
                    className="w-full border border-border bg-background p-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black tracking-widest uppercase block mb-2">Content</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Write your full article content here..."
                    rows={8}
                    className="w-full border border-border bg-background p-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black tracking-widest uppercase block mb-2">Author</label>
                    <Input
                      value={form.author}
                      onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                      placeholder="DIDEE Editorial"
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black tracking-widest uppercase block mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-border bg-background p-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">— Select category —</option>
                      {JOURNAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black tracking-widest uppercase block mb-2">Cover Image URL</label>
                  <Input
                    value={form.coverImage}
                    onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                    placeholder="https://... or /images/..."
                    className="rounded-none"
                  />
                  {form.coverImage && (
                    <div className="mt-2 w-full h-32 bg-neutral-100 overflow-hidden">
                      <img src={form.coverImage} alt="cover preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? "bg-green-500" : "bg-neutral-200"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : ""}`} />
                  </button>
                  <label className="text-sm font-medium cursor-pointer" onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                    {form.published ? "Published — visible on site" : "Draft — not visible on site"}
                  </label>
                </div>

                <div className="pt-2 flex gap-3 border-t border-border">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-none">
                    {saving ? "Saving..." : editPost ? "Update Post" : "Publish Post"}
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
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background w-full max-w-sm shadow-xl p-6">
              <h3 className="font-bold text-lg mb-2">Delete Post?</h3>
              <p className="text-muted-foreground text-sm mb-6">This will permanently remove this journal post.</p>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm!)} className="rounded-none flex-1">Delete</Button>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-none">Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
