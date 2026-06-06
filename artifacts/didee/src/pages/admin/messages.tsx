import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Check, Clock, Mail, Phone, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  unread: "bg-red-100 text-red-700",
  read: "bg-yellow-100 text-yellow-700",
  replied: "bg-green-100 text-green-700",
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reply, setReply] = useState<Record<number, string>>({});
  const [sending, setSending] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { credentials: "include" });
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function sendReply(id: number) {
    const text = reply[id]?.trim();
    if (!text) return;
    setSending(id);
    try {
      const res = await fetch(`/api/contact/${id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reply: text }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(m => m.map(msg => msg.id === id ? updated : msg));
        setReply(r => ({ ...r, [id]: "" }));
      }
    } finally {
      setSending(null);
    }
  }

  async function markRead(id: number) {
    await fetch(`/api/contact/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "read" }),
    });
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, status: "read" } : msg));
  }

  const filtered = messages.filter(m => filter === "all" || m.status === filter);
  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif">Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">Customer contact messages from the website</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadCount} unread</span>
          )}
          <button onClick={load} className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-medium tracking-widest uppercase hover:border-foreground transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border border-border mb-6 w-fit">
        {(["all", "unread", "replied"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2.5 text-[11px] font-black tracking-widest uppercase transition-colors ${filter === f ? "bg-foreground text-background" : "hover:bg-muted"}`}>
            {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${messages.filter(m => m.status === "unread").length})` : `Replied (${messages.filter(m => m.status === "replied").length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-16 text-center text-muted-foreground">Loading messages…</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-serif text-xl mb-2 text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground">Messages from the Contact Us page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`border ${msg.status === "unread" ? "border-[#C9A86A]/40 bg-[#C9A86A]/5" : "border-border bg-background"}`}>
              {/* Header */}
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id);
                  if (msg.status === "unread") markRead(msg.id);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-[#C9A86A]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#C9A86A] font-bold text-sm">{msg.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <p className={`font-medium text-sm ${msg.status === "unread" ? "font-bold" : ""}`}>{msg.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${STATUS_COLORS[msg.status] ?? "bg-muted text-muted-foreground"}`}>{msg.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject} — {msg.message.substring(0, 60)}…</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}</p>
                  <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                {expanded === msg.id ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </div>

              {/* Expanded */}
              {expanded === msg.id && (
                <div className="px-6 pb-6 border-t border-border">
                  {/* Contact info */}
                  <div className="flex flex-wrap gap-6 py-4 border-b border-border mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-[#C9A86A]" />
                      <a href={`mailto:${msg.email}`} className="hover:text-[#C9A86A] transition-colors">{msg.email}</a>
                    </div>
                    {msg.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-[#C9A86A]" />
                        <span>{msg.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(msg.createdAt).toLocaleString("en-NP")}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <p className="text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-3">Topic: {msg.subject}</p>
                    <div className="bg-muted/40 border border-border p-5 rounded-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>

                  {/* Existing reply */}
                  {msg.adminReply && (
                    <div className="mb-6 border-l-4 border-[#C9A86A] pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-3.5 h-3.5 text-[#C9A86A]" />
                        <p className="text-[11px] font-black tracking-widest uppercase text-[#C9A86A]">Your Reply</p>
                        {msg.repliedAt && <p className="text-xs text-muted-foreground">· {new Date(msg.repliedAt).toLocaleString("en-NP")}</p>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{msg.adminReply}</p>
                    </div>
                  )}

                  {/* Reply form */}
                  <div>
                    <label className="block text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-3">
                      {msg.adminReply ? "Update Reply" : "Write a Reply"}
                    </label>
                    <textarea
                      value={reply[msg.id] ?? ""}
                      onChange={(e) => setReply(r => ({ ...r, [msg.id]: e.target.value }))}
                      placeholder="Type your reply to the customer…"
                      rows={4}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none mb-3"
                    />
                    <button
                      onClick={() => sendReply(msg.id)}
                      disabled={sending === msg.id || !reply[msg.id]?.trim()}
                      className="flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[11px] font-black tracking-widest uppercase hover:bg-[#C9A86A] transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {sending === msg.id ? "Sending…" : "Send Reply"}
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">The customer can view your reply in their account dashboard under "Messages".</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
