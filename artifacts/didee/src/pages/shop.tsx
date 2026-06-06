import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useListProducts, useListCategories, useGetFeaturedCollections } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRICE_RANGES = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under NPR 1,500", min: undefined, max: 1500 },
  { label: "NPR 1,500 – 3,000", min: 1500, max: 3000 },
  { label: "NPR 3,000 – 6,000", min: 3000, max: 6000 },
  { label: "Over NPR 6,000", min: 6000, max: undefined },
];

export default function Shop() {
  const search = useSearch();

  // Parse URL query params on mount and when URL changes
  const params = new URLSearchParams(search);
  const urlCategory = params.get("category") ?? undefined;
  const urlCollection = params.get("collection") ?? undefined;
  const urlSort = params.get("sort") ?? "newest";

  const [sortBy, setSortBy] = useState(urlSort);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(urlCategory);
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>(urlCollection);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;

  // Sync filters when URL changes (e.g. user navigates from home page category links)
  useEffect(() => {
    const p = new URLSearchParams(search);
    setSelectedCategory(p.get("category") ?? undefined);
    setSelectedCollection(p.get("collection") ?? undefined);
    setSortBy(p.get("sort") ?? "newest");
    setOffset(0);
  }, [search]);

  const priceRange = PRICE_RANGES[selectedPriceIdx];

  const { data: productsData, isLoading } = useListProducts({
    limit: LIMIT,
    offset,
    sortBy: sortBy as any,
    categorySlug: selectedCategory,
    collectionSlug: selectedCollection,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  const { data: categories } = useListCategories();
  const { data: collections } = useGetFeaturedCollections();

  // Reset offset when filters change
  useEffect(() => { setOffset(0); }, [selectedCategory, selectedCollection, selectedPriceIdx, sortBy]);

  const activeFilterCount = [selectedCategory, selectedCollection, selectedPriceIdx > 0 ? true : undefined].filter(Boolean).length;

  function clearFilters() {
    setSelectedCategory(undefined);
    setSelectedCollection(undefined);
    setSelectedPriceIdx(0);
  }

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Active filters indicator */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
          <button onClick={clearFilters} className="text-xs font-medium underline text-muted-foreground hover:text-foreground transition-colors">
            Clear all
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-5 text-foreground">Category</h3>
        <ul className="space-y-2.5">
          <li>
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`text-sm w-full text-left py-1 transition-colors ${
                !selectedCategory ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Categories
              {!selectedCategory && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#C9A86A] inline-block" />}
            </button>
          </li>
          {categories?.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.slug === selectedCategory ? undefined : cat.slug)}
                className={`text-sm w-full text-left py-1 transition-colors ${
                  selectedCategory === cat.slug ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
                {selectedCategory === cat.slug && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#C9A86A] inline-block" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Collections */}
      <div>
        <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-5 text-foreground">Collection</h3>
        <ul className="space-y-2.5">
          <li>
            <button
              onClick={() => setSelectedCollection(undefined)}
              className={`text-sm w-full text-left py-1 transition-colors ${
                !selectedCollection ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Collections
              {!selectedCollection && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#C9A86A] inline-block" />}
            </button>
          </li>
          {collections?.map((col) => (
            <li key={col.id}>
              <button
                onClick={() => setSelectedCollection(col.slug === selectedCollection ? undefined : col.slug)}
                className={`text-sm w-full text-left py-1 transition-colors ${
                  selectedCollection === col.slug ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {col.name}
                {selectedCollection === col.slug && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#C9A86A] inline-block" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-5 text-foreground">Price</h3>
        <ul className="space-y-2.5">
          {PRICE_RANGES.map((range, i) => (
            <li key={i}>
              <button
                onClick={() => setSelectedPriceIdx(i)}
                className={`text-sm w-full text-left py-1 transition-colors ${
                  selectedPriceIdx === i ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range.label}
                {selectedPriceIdx === i && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#C9A86A] inline-block" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">DIDEE Store</p>
            <h1 className="font-serif text-5xl font-medium tracking-wide">
              {selectedCategory
                ? categories?.find(c => c.slug === selectedCategory)?.name ?? "Products"
                : selectedCollection
                ? collections?.find(c => c.slug === selectedCollection)?.name ?? "Products"
                : "All Products"}
            </h1>
            {productsData && (
              <p className="text-muted-foreground text-sm mt-2">
                {productsData.total} {productsData.total === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium hover:border-foreground transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            <div className="flex items-center gap-3 ml-auto md:ml-0">
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-border py-2 pr-6 text-sm focus:outline-none focus:border-foreground cursor-pointer"
              >
                <option value="newest">New Arrivals</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-56 shrink-0">
            <FilterPanel />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-[3/4] mb-4" />
                    <div className="h-4 bg-muted w-2/3 mb-2" />
                    <div className="h-4 bg-muted w-1/3" />
                  </div>
                ))}
              </div>
            ) : productsData?.products.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                  {productsData.products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {productsData.total > LIMIT && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                      disabled={offset === 0}
                      className="rounded-none px-6 py-5 text-xs tracking-widest uppercase border-border"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(offset / LIMIT) + 1} of {Math.ceil(productsData.total / LIMIT)}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setOffset(offset + LIMIT)}
                      disabled={offset + LIMIT >= productsData.total}
                      className="rounded-none px-6 py-5 text-xs tracking-widest uppercase border-border hover:bg-foreground hover:text-background"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 text-center">
                <p className="font-serif text-2xl mb-4">No products found</p>
                <p className="text-muted-foreground text-sm mb-8">Try adjusting your filters.</p>
                <Button onClick={clearFilters} variant="outline" className="rounded-none px-8 py-4 text-xs tracking-widest uppercase">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-background overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-medium tracking-[0.2em] uppercase">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel />
                <Button
                  className="w-full mt-8 rounded-none tracking-widest uppercase text-sm"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
