import { dbConnect } from "@/lib/mongoDb";
import { CATEGORIES } from "@/lib/constants/categories";

export async function getCategoryStats() {
  const db = await dbConnect();
  const products = await db.collection("products").find({}).toArray();

  const bySlug = new Map(
    CATEGORIES.map((c) => [
      c.slug,
      {
        name: c.name,
        slug: c.slug,
        totalProducts: 0,
        activeProducts: 0,
        totalStock: 0,
        inventoryValue: 0,
        priceSum: 0,
        image: null,
      },
    ]),
  );

  for (const p of products) {
    const slug = p.category?.slug;
    let entry = bySlug.get(slug);

    if (!entry) {
      // A product referencing a category outside the known taxonomy still
      // needs to be counted somewhere rather than silently dropped.
      entry = {
        name: p.category?.name || "Uncategorized",
        slug: slug || "uncategorized",
        totalProducts: 0,
        activeProducts: 0,
        totalStock: 0,
        inventoryValue: 0,
        priceSum: 0,
        image: null,
      };
      bySlug.set(entry.slug, entry);
    }

    entry.totalProducts += 1;
    if (p.status === "active") entry.activeProducts += 1;
    entry.totalStock += p.stock || 0;
    entry.inventoryValue += (p.stock || 0) * (p.price || 0);
    entry.priceSum += p.price || 0;
    if (!entry.image && p.images?.[0]?.url) entry.image = p.images[0].url;
  }

  return [...bySlug.values()]
    .map((c) => ({
      ...c,
      avgPrice: c.totalProducts > 0 ? c.priceSum / c.totalProducts : 0,
    }))
    .sort((a, b) => b.totalProducts - a.totalProducts);
}
