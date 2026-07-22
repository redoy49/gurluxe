"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { deleteFromCloudinary } from "@/lib/cloudinary/destroy";
import { generateSlug } from "@/lib/utils/generateSlug";

export async function addProduct(formData) {
  try {
    const db = await dbConnect();

    const productData = JSON.parse(formData.get("product"));
    const files = formData.getAll("images");

    const uploadedImages = [];

    for (const file of files) {
      const image = await uploadToCloudinary(file);

      if (image) {
        uploadedImages.push(image);
      }
    }

    const product = {
      name: productData.name,
      slug: generateSlug(productData.name),
      sku: productData.sku,

      category: {
        name: productData.category.name,
        slug: productData.category.slug,
      },

      images: uploadedImages,
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

    revalidatePath("/dashboard/products");

    return {
      success: true,
      insertedId: result.insertedId.toString(),
      message: "Product added successfully",
    };
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    return {
      success: false,
      message: error.message || "Failed to add product",
    };
  }
}

export async function getProducts() {
  const db = await dbConnect();

  const products = await db
    .collection("products")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id) {
  const db = await dbConnect();

  const product = await db.collection("products").findOne({
    _id: new ObjectId(id),
  });

  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
  };
}

export async function updateProduct(formData) {
  try {
    const db = await dbConnect();

    const id = formData.get("_id");
    const updateData = JSON.parse(formData.get("product"));

    const product = {
      name: updateData.name,
      slug: generateSlug(updateData.name),
      sku: updateData.sku,

      category: {
        name: updateData.category.name,
        slug: updateData.category.slug,
      },

      price: Number(updateData.price),
      comparePrice: Number(updateData.comparePrice) || 0,
      stock: Number(updateData.stock),

      flags: {
        featured: updateData.featured || false,
        newArrival: updateData.newArrival || false,
        bestSeller: updateData.bestSeller || false,
      },

      status: "active",

      shortDescription: updateData.shortDescription,
      description: updateData.description,

      colors: updateData.colors
        ? updateData.colors.split(",").map((color) => color.trim())
        : [],

      materials: updateData.materials
        ? updateData.materials.split(",").map((material) => material.trim())
        : [],

      updatedAt: new Date(),
    };

    await db.collection("products").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: product,
      },
    );

    revalidatePath("/dashboard/products");
    revalidatePath(`/shop/${product.slug}`);

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return {
      success: false,
      message: error.message || "Failed to update product",
    };
  }
}

export async function deleteProduct(id) {
  try {
    const db = await dbConnect();

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    for (const image of product.images || []) {
      await deleteFromCloudinary(image.publicId);
    }

    await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
