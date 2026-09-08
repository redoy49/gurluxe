import { dbConnect } from "../mongoDb";

// Featured Products
export async function getFeaturedProducts() {
  const db = await dbConnect();

  const products = await db
    .collection("products")
    .find({ "flags.featured": true })
    .limit(8)
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

// New Arrivals
export async function getNewArrivalProducts() {
  const db = await dbConnect();

  const products = await db
    .collection("products")
    .find({ "flags.newArrival": true })
    .sort({ _id: -1 }) // newest first (better than createdAt if missing)
    .limit(8)
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

// Best Sellers
export async function getBestSellerProducts() {
  const db = await dbConnect();

  const products = await db
    .collection("products")
    .find({ "flags.bestSeller": true })
    .sort({ soldCount: -1 })
    .limit(3)
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

// All Products
export async function getProducts() {
  const db = await dbConnect();

  const products = await db.collection("products").find({}).toArray();

  return JSON.parse(JSON.stringify(products));
}

// Single Product
export async function getProductBySlug(slug) {
  const db = await dbConnect();

  const product = await db.collection("products").findOne({ slug });

  return JSON.parse(JSON.stringify(product));
}

// Products By Category
export async function getProductsByCategory(categorySlug) {
  const db = await dbConnect();

  const products = await db
    .collection("products")
    .find({ "category.slug": categorySlug })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

// Get collections
export async function getCollections() {
  const db = await dbConnect();

  const collections = await db
    .collection("products")
    .aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: "$category.slug",
          name: { $first: "$category.name" },
          slug: { $first: "$category.slug" },
          totalProducts: { $sum: 1 },
          product: { $first: "$$ROOT" },
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(collections));
}
