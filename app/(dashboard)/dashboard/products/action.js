"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { deleteFromCloudinary } from "@/lib/cloudinary/destroy";

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
      slug: productData.slug,
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

  return await db
    .collection("products")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
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
  const db = await dbConnect();

  const id = formData.get("_id");
  const updateData = JSON.parse(formData.get("product"));

  await db.collection("products").updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath("/dashboard/products");

  return {
    success: true,
    message: "Product updated successfully",
  };
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