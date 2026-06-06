import { useListJournalPosts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { STATIC_ARTICLES } from "./staticArticles";

export default function Journal() {
  const { data: postsData, isLoading } = useListJournalPosts();
  const posts = (postsData && postsData.length > 0) ? postsData : STATIC_ARTICLES;

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      {/* Header */}
      <div className="container mx-auto px-4 mb-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-border pb-10">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3 font-black">DIDEE Editorial</p>
            <h1 className="font-serif text-6xl md:text-7xl font-medium tracking-tight">The Journal</h1>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Stories, styling guides, and behind-the-scenes glimpses into the world of DIDEE and modern Nepalese culture.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-[4/3] mb-4" />
                <div className="h-3 bg-muted w-1/4 mb-3" />
                <div className="h-6 bg-muted w-3/4 mb-2" />
                <div className="h-4 bg-muted w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {posts[0] && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-16 group"
              >
                <Link href={`/journal/${posts[0].slug}`} className="block">
                  <div className="relative overflow-hidden aspect-[21/8] bg-neutral-bg mb-8">
                    <img
                      src={posts[0].coverImage ?? ""}
                      alt={posts[0].title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-end p-10">
                      <div className="max-w-xl text-white">
                        <div className="flex items-center gap-3 text-[11px] font-black tracking-[0.3em] uppercase mb-4 text-white/60">
                          <span>{posts[0].category ?? "Editorial"}</span>
                          <span>•</span>
                          <span>{posts[0].readMinutes ?? 5} Min Read</span>
                          <span>•</span>
                          <span>{(posts[0] as any).date ?? ""}</span>
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4">{posts[0].title}</h2>
                        <p className="text-white/70 text-sm line-clamp-2 mb-6">{posts[0].excerpt}</p>
                        <span className="text-[11px] font-black tracking-[0.3em] uppercase border-b border-white pb-1">
                          Read Article →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Grid of remaining posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
              {posts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/journal/${post.slug}`} className="block">
                    <div className="overflow-hidden aspect-[4/3] bg-neutral-bg mb-6">
                      <img
                        src={post.coverImage ?? ""}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground mb-3">
                      <span>{post.category ?? "Editorial"}</span>
                      <span>•</span>
                      <span>{post.readMinutes ?? 5} Min</span>
                      {(post as any).date && <><span>•</span><span>{(post as any).date}</span></>}
                    </div>
                    <h2 className="font-serif text-2xl leading-snug mb-3 group-hover:text-[#C9A86A] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-5">{post.excerpt}</p>
                    <span className="text-[11px] font-black tracking-[0.25em] uppercase border-b border-foreground pb-0.5 group-hover:border-[#C9A86A] group-hover:text-[#C9A86A] transition-colors">
                      Read Article
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
