import { useGetJournalPost, getGetJournalPostQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User } from "lucide-react";
import { findStaticArticle, STATIC_ARTICLES } from "./staticArticles";

export default function JournalShow() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: apiPost, isLoading } = useGetJournalPost(slug, {
    query: { enabled: !!slug, queryKey: getGetJournalPostQueryKey(slug) }
  });

  const staticPost = findStaticArticle(slug);
  const post = apiPost ?? staticPost;

  if (isLoading && !staticPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm tracking-widest uppercase">Loading article…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="font-serif text-3xl text-muted-foreground">Article not found</p>
        <Link href="/journal" className="text-[11px] font-black tracking-[0.3em] uppercase border-b border-foreground pb-1 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">
          ← Back to Journal
        </Link>
      </div>
    );
  }

  const currentIdx = STATIC_ARTICLES.findIndex(a => a.slug === slug);
  const related = STATIC_ARTICLES.filter((_, i) => i !== currentIdx).slice(0, 2);

  const authorName = (post as any).author ?? "DIDEE Editorial";
  const postDate = (post as any).date ?? "";
  const postContent = (post as any).content ?? `<p>${post.excerpt ?? "Full article coming soon."}</p>`;

  return (
    <article className="min-h-screen bg-background pb-32">
      {/* Hero */}
      <div className="relative h-[75vh] flex items-end justify-center pb-24 overflow-hidden">
        {post.coverImage ? (
          <>
            <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[#0A0A0A]" />
        )}

        <Link
          href="/journal"
          className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white text-[11px] font-black tracking-[0.2em] uppercase transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          The Journal
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 text-[11px] font-black tracking-[0.3em] uppercase mb-6 text-white/50">
            <span>{post.category ?? "Editorial"}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readMinutes ?? 5} Min Read</span>
            {postDate && <><span>•</span><span>{postDate}</span></>}
          </div>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">{post.title}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <User className="w-3.5 h-3.5" />
            <span>{authorName}</span>
          </div>
        </motion.div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="container mx-auto px-4 mt-16 max-w-3xl"
      >
        {post.excerpt && (
          <p className="text-xl md:text-2xl leading-relaxed font-serif text-muted-foreground mb-14 italic border-l-4 border-[#C9A86A] pl-6">
            {post.excerpt}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-wide
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-p:leading-loose prose-p:text-foreground/75 prose-p:mb-6
            prose-strong:text-foreground prose-strong:font-bold
            prose-a:text-[#C9A86A]"
          dangerouslySetInnerHTML={{ __html: postContent }}
        />

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground mb-1">Written by</p>
            <p className="font-medium">{authorName}</p>
          </div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.3em] uppercase border-b border-foreground pb-1 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Journal
          </Link>
        </div>

        {/* More articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <p className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground mb-8 text-center">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {related.map((next) => (
                <Link key={next.slug} href={`/journal/${next.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-bg mb-4">
                    <img
                      src={next.coverImage}
                      alt={next.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-2">{next.category}</p>
                  <h3 className="font-serif text-xl leading-snug group-hover:text-[#C9A86A] transition-colors">{next.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </article>
  );
}
