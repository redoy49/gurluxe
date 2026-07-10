"use server";

import { dbConnect } from "@/lib/mongoDb";

export async function addProduct(productData) {
  try {
    const db = await dbConnect();

    const product = {
      name: productData.name,
      slug: productData.slug,
      sku: productData.sku,

      category: {
        name: productData.category.name,
        slug: productData.category.slug,
      },

      // TODO: Upload images to Cloudinary
      images: [],

      // TODO: Upload videos to Cloudinary
      videos: [],

      price: Number(productData.price),
      comparePrice: Number(productData.comparePrice) || 0,
      stock: Number(productData.stock),
      soldCount: 0,

      flags: {
        featured: productData.featured || false,
        newArrival: productData.newArrival || false,
        bestSeller: productData.bestSeller || false,
      },

      status: "active",
      shortDescription: productData.shortDescription,
      description: productData.description,

      colors: productData.colors
        ? productData.colors.split(",").map((color) => color.trim())
        : [],

      materials: productData.materials
        ? productData.materials.split(",").map((material) => material.trim())
        : [],

      rating: {
        average: 0,
        count: 0,
      },

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);

    return {
      success: true,
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    return {
      success: false,
      message: "Failed to add product",
    };
  }
}
