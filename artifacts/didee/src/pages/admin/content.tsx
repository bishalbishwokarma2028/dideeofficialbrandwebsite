import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, ChevronRight, Home, ShoppingBag, FolderTree, Image, BookOpen, Info, Clock, Users, Wrench, Phone, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SECTIONS = [
  { id: "home",         label: "Home",         icon: Home,        color: "#C9A86A" },
  { id: "shop",         label: "Shop",          icon: ShoppingBag, color: "#60A5FA" },
  { id: "collections",  label: "Collections",   icon: FolderTree,  color: "#34D399" },
  { id: "lookbook",     label: "Lookbook",      icon: Image,       color: "#EC4899" },
  { id: "journal",      label: "Journal",       icon: BookOpen,    color: "#A78BFA" },
  { id: "about",        label: "About DIDEE",   icon: Info,        color: "#F59E0B" },
  { id: "our-story",    label: "Our Story",     icon: Clock,       color: "#06B6D4" },
  { id: "who-we-are",   label: "Who We Are",    icon: Users,       color: "#10B981" },
  { id: "our-services", label: "Our Services",  icon: Wrench,      color: "#F97316" },
  { id: "contact",      label: "Contact",       icon: Phone,       color: "#8B5CF6" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-white/40">{label}</label>
      {hint && <p className="text-[11px] text-white/25 -mt-0.5 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A86A] transition-colors"
      style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6 }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A86A] transition-colors resize-y"
      style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6 }}
    />
  );
}

function ImagePreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    <div className="relative mt-2 overflow-hidden rounded-lg" style={{ height: 120 }}>
      <img src={url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
      <div className="absolute inset-0 flex items-end p-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white transition-colors">
          <ExternalLink className="w-2.5 h-2.5" /> Preview
        </a>
      </div>
    </div>
  );
}

type AnyObj = Record<string, any>;

function HomeEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const slides = Array.isArray(data.heroSlides) ? data.heroSlides : [{ title: "", subtitle: "", cta1: "", cta2: "", image: "" }];
  function updateSlide(i: number, key: string, val: string) {
    const next = [...slides];
    next[i] = { ...next[i], [key]: val };
    onChange({ ...data, heroSlides: next });
  }
  function addSlide() { onChange({ ...data, heroSlides: [...slides, { title: "", subtitle: "", cta1: "", cta2: "", image: "" }] }); }
  function removeSlide(i: number) { onChange({ ...data, heroSlides: slides.filter((_: any, idx: number) => idx !== i) }); }
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-black uppercase tracking-wider text-white/50">Hero Slides</p>
          <button onClick={addSlide} className="flex items-center gap-1.5 text-[11px] text-[#C9A86A] hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Slide
          </button>
        </div>
        {slides.map((slide: any, i: number) => (
          <div key={i} className="mb-4 p-4 rounded-lg space-y-3" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-black text-white/40 uppercase tracking-wider">Slide {i + 1}</p>
              {slides.length > 1 && (
                <button onClick={() => removeSlide(i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Field label="Title"><TextInput value={slide.title} onChange={v => updateSlide(i, "title", v)} placeholder="e.g. FRESH DROP" /></Field>
            <Field label="Subtitle"><TextInput value={slide.subtitle} onChange={v => updateSlide(i, "subtitle", v)} placeholder="e.g. FIVE LOOKS. ONE STATEMENT." /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Button 1"><TextInput value={slide.cta1} onChange={v => updateSlide(i, "cta1", v)} placeholder="SHOP COLLECTION" /></Field>
              <Field label="Button 2"><TextInput value={slide.cta2} onChange={v => updateSlide(i, "cta2", v)} placeholder="VIEW LOOKBOOK" /></Field>
            </div>
            <Field label="Image URL"><TextInput value={slide.image} onChange={v => updateSlide(i, "image", v)} placeholder="https://... or /images/..." /></Field>
            <ImagePreview url={slide.image} />
          </div>
        ))}
      </div>
      <div className="h-px bg-white/5" />
      <Field label="Section — Featured Collections Title"><TextInput value={data.featuredTitle ?? ""} onChange={v => onChange({ ...data, featuredTitle: v })} placeholder="THE COLLECTIONS" /></Field>
      <Field label="Featured Collections Subtitle"><TextArea value={data.featuredSubtitle ?? ""} onChange={v => onChange({ ...data, featuredSubtitle: v })} rows={2} /></Field>
      <Field label="Section — New Arrivals Title"><TextInput value={data.newArrivalsTitle ?? ""} onChange={v => onChange({ ...data, newArrivalsTitle: v })} placeholder="NEW ARRIVALS" /></Field>
      <Field label="New Arrivals Subtitle"><TextArea value={data.newArrivalsSubtitle ?? ""} onChange={v => onChange({ ...data, newArrivalsSubtitle: v })} rows={2} /></Field>
      <Field label="Section — DIDEE Standard Title"><TextInput value={data.standardTitle ?? ""} onChange={v => onChange({ ...data, standardTitle: v })} placeholder="THE DIDEE STANDARD" /></Field>
      <Field label="DIDEE Standard Subtitle"><TextArea value={data.standardSubtitle ?? ""} onChange={v => onChange({ ...data, standardSubtitle: v })} rows={2} /></Field>
    </div>
  );
}

function SimpleEditor({ data, onChange, fields }: { data: AnyObj; onChange: (d: AnyObj) => void; fields: { key: string; label: string; type?: "text" | "textarea" | "image"; hint?: string; rows?: number }[] }) {
  return (
    <div className="space-y-5">
      {fields.map(f => (
        <Field key={f.key} label={f.label} hint={f.hint}>
          {f.type === "textarea" ? (
            <TextArea value={data[f.key] ?? ""} onChange={v => onChange({ ...data, [f.key]: v })} rows={f.rows ?? 4} />
          ) : (
            <TextInput value={data[f.key] ?? ""} onChange={v => onChange({ ...data, [f.key]: v })} />
          )}
          {f.type === "image" && <ImagePreview url={data[f.key] ?? ""} />}
        </Field>
      ))}
    </div>
  );
}

function OurStoryEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const chapters = Array.isArray(data.chapters) ? data.chapters : [];
  function updateChapter(i: number, key: string, val: string) {
    const next = [...chapters];
    next[i] = { ...next[i], [key]: val };
    onChange({ ...data, chapters: next });
  }
  function addChapter() { onChange({ ...data, chapters: [...chapters, { heading: "", body: "" }] }); }
  function removeChapter(i: number) { onChange({ ...data, chapters: chapters.filter((_: any, idx: number) => idx !== i) }); }
  return (
    <div className="space-y-5">
      <Field label="Page Title"><TextInput value={data.title ?? ""} onChange={v => onChange({ ...data, title: v })} /></Field>
      <Field label="Hero Image URL" hint="Optional background image"><TextInput value={data.heroImage ?? ""} onChange={v => onChange({ ...data, heroImage: v })} /><ImagePreview url={data.heroImage ?? ""} /></Field>
      <div className="h-px bg-white/5" />
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-black uppercase tracking-wider text-white/50">Story Chapters</p>
          <button onClick={addChapter} className="flex items-center gap-1.5 text-[11px] text-[#C9A86A] hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /> Add Chapter</button>
        </div>
        {chapters.map((ch: any, i: number) => (
          <div key={i} className="mb-4 p-4 rounded-lg space-y-3" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-black text-white/40 uppercase tracking-wider">Chapter {i + 1}</p>
              {chapters.length > 1 && <button onClick={() => removeChapter(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <Field label="Heading"><TextInput value={ch.heading} onChange={v => updateChapter(i, "heading", v)} /></Field>
            <Field label="Body"><TextArea value={ch.body} onChange={v => updateChapter(i, "body", v)} rows={3} /></Field>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesEditor({ data, onChange }: { data: AnyObj; onChange: (d: AnyObj) => void }) {
  const services = Array.isArray(data.services) ? data.services : [];
  function updateService(i: number, key: string, val: string) {
    const next = [...services];
    next[i] = { ...next[i], [key]: val };
    onChange({ ...data, services: next });
  }
  function addService() { onChange({ ...data, services: [...services, { title: "", description: "" }] }); }
  function removeService(i: number) { onChange({ ...data, services: services.filter((_: any, idx: number) => idx !== i) }); }
  return (
    <div className="space-y-5">
      <Field label="Page Title"><TextInput value={data.title ?? ""} onChange={v => onChange({ ...data, title: v })} /></Field>
      <Field label="Page Subtitle"><TextArea value={data.subtitle ?? ""} onChange={v => onChange({ ...data, subtitle: v })} rows={2} /></Field>
      <div className="h-px bg-white/5" />
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-black uppercase tracking-wider text-white/50">Services</p>
          <button onClick={addService} className="flex items-center gap-1.5 text-[11px] text-[#C9A86A] hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /> Add Service</button>
        </div>
        {services.map((s: any, i: number) => (
          <div key={i} className="mb-4 p-4 rounded-lg space-y-3" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-black text-white/40 uppercase tracking-wider">Service {i + 1}</p>
              {services.length > 1 && <button onClick={() => removeService(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <Field label="Title"><TextInput value={s.title} onChange={v => updateService(i, "title", v)} /></Field>
            <Field label="Description"><TextArea value={s.description} onChange={v => updateService(i, "description", v)} rows={2} /></Field>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionEditor({ sectionId, data, onChange }: { sectionId: string; data: AnyObj; onChange: (d: AnyObj) => void }) {
  switch (sectionId) {
    case "home": return <HomeEditor data={data} onChange={onChange} />;
    case "our-story": return <OurStoryEditor data={data} onChange={onChange} />;
    case "our-services": return <ServicesEditor data={data} onChange={onChange} />;
    case "shop": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "subtitle", label: "Page Subtitle", type: "textarea", rows: 2 },
      { key: "heroImage", label: "Hero Image URL", type: "image" },
    ]} />;
    case "collections": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "subtitle", label: "Page Subtitle", type: "textarea", rows: 2 },
      { key: "heroImage", label: "Hero Image URL", type: "image" },
    ]} />;
    case "lookbook": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "subtitle", label: "Page Subtitle", type: "textarea", rows: 3 },
    ]} />;
    case "journal": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "subtitle", label: "Page Subtitle", type: "textarea", rows: 2 },
      { key: "heroImage", label: "Hero Image URL", type: "image" },
    ]} />;
    case "about": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "intro", label: "Intro Paragraph", type: "textarea", rows: 2 },
      { key: "body", label: "Main Body", type: "textarea", rows: 4 },
    ]} />;
    case "who-we-are": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "intro", label: "Intro Paragraph", type: "textarea", rows: 3 },
      { key: "founderName", label: "Founder Name" },
      { key: "founderTitle", label: "Founder Title / Role" },
      { key: "founderBio", label: "Founder Bio", type: "textarea", rows: 3 },
      { key: "founderImage", label: "Founder Image URL", type: "image" },
    ]} />;
    case "contact": return <SimpleEditor data={data} onChange={onChange} fields={[
      { key: "title", label: "Page Title" },
      { key: "subtitle", label: "Page Subtitle", type: "textarea", rows: 2 },
      { key: "address", label: "Address" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone Number" },
      { key: "instagram", label: "Instagram Handle" },
      { key: "facebook", label: "Facebook Page" },
      { key: "tiktok", label: "TikTok Handle" },
    ]} />;
    default: return <p className="text-white/30 text-sm">No editor available for this section yet.</p>;
  }
}

export default function AdminContent() {
  const [activeSectionId, setActiveSectionId] = useState("home");
  const [contentMap, setContentMap] = useState<Record<string, AnyObj>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { toast } = useToast();

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/content"), { credentials: "include" });
      const data = await res.json();
      setContentMap(data);
    } catch {
      toast({ title: "Error loading content", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function handleChange(sectionId: string, data: AnyObj) {
    setContentMap(prev => ({ ...prev, [sectionId]: data }));
    setDirty(true);
  }

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    try {
      const res = await fetch(apiUrl(`/api/content/${activeSectionId}`), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentMap[activeSectionId] ?? {}),
      });
      if (res.ok) {
        toast({ title: "Saved!", description: `${SECTIONS.find(s => s.id === activeSectionId)?.label} content updated.` });
        setDirty(false);
      } else {
        toast({ title: "Failed to save", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const activeSection = SECTIONS.find(s => s.id === activeSectionId)!;
  const sectionData = contentMap[activeSectionId] ?? {};

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Left sidebar */}
      <div className="w-64 shrink-0 flex flex-col" style={{ background: "#111", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-5 py-5 border-b border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Section Content</p>
          <p className="text-[11px] text-white/20 mt-0.5">Edit any page of the site</p>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => { setActiveSectionId(section.id); setDirty(false); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                style={{
                  background: isActive ? `${section.color}12` : "transparent",
                  borderLeft: isActive ? `2px solid ${section.color}` : "2px solid transparent",
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: isActive ? `${section.color}20` : "rgba(255,255,255,0.05)" }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? section.color : "rgba(255,255,255,0.3)" }} />
                </div>
                <span className={`text-[12px] font-bold transition-colors ${isActive ? "text-white" : "text-white/35 hover:text-white/60"}`}>
                  {section.label}
                </span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: section.color }} />}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/5">
          <a href={`/${activeSectionId === "home" ? "" : activeSectionId}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors">
            <ExternalLink className="w-3 h-3" /> Preview on site
          </a>
        </div>
      </div>

      {/* Main editing area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#111" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${activeSection.color}20`, border: `1px solid ${activeSection.color}30` }}
            >
              <activeSection.icon className="w-4.5 h-4.5" style={{ color: activeSection.color }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{activeSection.label}</h2>
              <p className="text-[11px] text-white/25">Page content & settings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {dirty && (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-amber-400 font-bold">
                Unsaved changes
              </motion.span>
            )}
            <button
              onClick={loadAll}
              className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
              title="Refresh content"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-[12px] font-black uppercase tracking-wider transition-all disabled:opacity-40"
              style={{
                background: dirty ? "#C9A86A" : "rgba(255,255,255,0.08)",
                color: dirty ? "#000" : "rgba(255,255,255,0.3)",
              }}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }} />)}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSectionId}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
              >
                <SectionEditor
                  sectionId={activeSectionId}
                  data={sectionData}
                  onChange={data => handleChange(activeSectionId, data)}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
