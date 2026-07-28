import Link from "next/link";
import { getCollections } from "@/lib/queries/products";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-[#2b1d28] md:text-5xl">
            Our <span className="font-medium italic">Collections</span>
          </h1>

          <p className="mt-4 text-gray-500">Browse all handbag collections.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={collection.product.images[0].url}
                alt={collection.name}
                className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-8 left-8">
                <h2 className="text-3xl font-bold text-white">
                  {collection.name}
                </h2>

                <p className="mt-2 text-white/80">
                  {collection.totalProducts} Products
                </p>

                <span className="mt-4 inline-flex border border-white px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black">
                  Shop Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
