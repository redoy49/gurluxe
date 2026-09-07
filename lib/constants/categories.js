import { generateSlug } from "@/lib/utils/generateSlug";

// Single source of truth for the store's category taxonomy. Products don't
// reference a separate "categories" collection — each product embeds
// { name, slug } directly (see product.schema.js) — so this list is what
// both the product form and the admin categories view are built from.
export const CATEGORIES = [
  "Sling Bags",
  "Tote Bags",
  "Clutches",
  "Satchel Bags",
  "Crossbody Bags",
  "Hand Bags",
].map((name) => ({ name, slug: generateSlug(name) }));
