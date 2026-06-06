import { Link } from "wouter";
import { Collection } from "@workspace/api-client-react";
import { motion } from "framer-motion";

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const imageUrl = collection.image || "/images/collection-casual.png";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/collections/${collection.slug}`} className="block group relative overflow-hidden aspect-[4/5] bg-neutral-bg">
        <img 
          src={imageUrl} 
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <h3 className="font-serif text-3xl font-medium tracking-wider mb-2">{collection.name}</h3>
          <span className="text-sm font-medium tracking-widest uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            Explore Collection
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
