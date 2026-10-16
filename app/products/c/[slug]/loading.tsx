// Light placeholder for the category page (and the instant redirect to a
// single product) — replaces the dark product-listing skeleton it used to
// inherit from /products.
export default function ProductCategoryLoading() {
  return (
    <div className="px-5 pt-safe">
      <div className="mb-2 h-9 w-56 animate-pulse rounded-lg bg-black/[0.07]" />
      <div className="mb-6 h-4 w-40 animate-pulse rounded-full bg-black/[0.06]" />
      <div className="aspect-[3/4] w-[86%] animate-pulse rounded-[28px] bg-black/[0.06]" />
    </div>
  );
}
