import { useGetCollection, getGetCollectionQueryKey, useListProducts } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { ProductCard } from "@/components/ProductCard";

export default function CollectionShow() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  
  const { data: collection, isLoading: collectionLoading } = useGetCollection(slug, {
    query: { enabled: !!slug, queryKey: getGetCollectionQueryKey(slug) }
  });

  const { data: productsData, isLoading: productsLoading } = useListProducts({
    collectionSlug: slug,
    limit: 50
  }, {
    query: { enabled: !!slug }
  });

  if (collectionLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!collection) {
    return <div className="min-h-screen flex items-center justify-center">Collection not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Banner */}
      <div className="relative h-[60vh] flex items-center justify-center">
        {collection.bannerImage ? (
          <>
            <img src={collection.bannerImage} alt={collection.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-bg" />
        )}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-6xl md:text-7xl font-medium tracking-wide mb-6">{collection.name}</h1>
          {collection.description && (
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-24">
        {productsLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="animate-pulse">
                 <div className="bg-muted aspect-[3/4] mb-4"></div>
                 <div className="h-4 bg-muted w-2/3 mb-2"></div>
                 <div className="h-4 bg-muted w-1/3"></div>
               </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {productsData?.products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
