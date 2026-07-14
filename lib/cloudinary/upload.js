import cloudinary from "./cloudinary";

export async function uploadToCloudinary(file) {
  if (!file || file.size === 0) {
    return null;
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: "gurluxe/products",
        resource_type: "image",
      },
    );

    return {
      url: secure_url,
      publicId: public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image.");
  }
}
