"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { deleteFromCloudinary } from "@/lib/cloudinary/destroy";
import { generateSlug } from "@/lib/utils/generateSlug";
import { productSchema } from "@/lib/validations/product.schema";
import { requireAdminAction } from "@/lib/auth/authorize";

const FORBIDDEN = {
  success: false,
  message: "Forbidden: admin access required.",
};

export async function addProduct(formData) {
  const { authorized } = await requireAdminAction();
  if (!authorized) return FORBIDDEN;

  try {
    const db = await dbConnect();

    const rawProductData = JSON.parse(formData.get("product"));
    const parsed = productSchema.safeParse(rawProductData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid product data",
      };
    }

    const productData = parsed.data;
    const files = formData.getAll("images");

    if (files.length === 0) {
      return {
        success: false,
        message: "At least one product image is required",
      };
    }

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

      category: productData.category,

      images: uploadedImages,
      videos: [],

      price: productData.price,
      comparePrice: productData.comparePrice,
      stock: productData.stock,

      soldCount: productData.soldCount,

      sizes: productData.sizes,

      flags: {
        featured: productData.featured,
        newArrival: productData.newArrival,
        bestSeller: productData.bestSeller,
      },

      status: productData.status,

      shortDescription: productData.shortDescription,
      description: productData.description,

      colors: productData.colors,

      materials: productData.materials,

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
  const { authorized } = await requireAdminAction();
  if (!authorized) return [];

  const db = await dbConnect();

  const products = await db
    .collection("products")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id) {
  const { authorized } = await requireAdminAction();
  if (!authorized) return null;

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
  const { authorized } = await requireAdminAction();
  if (!authorized) return FORBIDDEN;

  try {
    const db = await dbConnect();

    const id = formData.get("_id");
    const rawUpdateData = JSON.parse(formData.get("product"));
    const parsed = productSchema.safeParse(rawUpdateData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid product data",
      };
    }

    const updateData = parsed.data;
    const files = formData.getAll("images");

    // Only upload/append images when new files were actually selected,
    // leaving the existing images array untouched otherwise.
    const newImages = [];
    for (const file of files) {
      const image = await uploadToCloudinary(file);
      if (image) newImages.push(image);
    }

    const product = {
      name: updateData.name,
      slug: generateSlug(updateData.name),
      sku: updateData.sku,

      category: updateData.category,

      price: updateData.price,
      comparePrice: updateData.comparePrice,
      stock: updateData.stock,
      soldCount: updateData.soldCount,

      sizes: updateData.sizes,

      flags: {
        featured: updateData.featured,
        newArrival: updateData.newArrival,
        bestSeller: updateData.bestSeller,
      },

      status: updateData.status,

      shortDescription: updateData.shortDescription,
      description: updateData.description,

      colors: updateData.colors,

      materials: updateData.materials,

      updatedAt: new Date(),
    };

    const update = { $set: product };
    if (newImages.length) {
      update.$push = { images: { $each: newImages } };
    }

    await db.collection("products").updateOne(
      {
        _id: new ObjectId(id),
      },
      update,
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
  const { authorized } = await requireAdminAction();
  if (!authorized) return FORBIDDEN;

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
