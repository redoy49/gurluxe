import cloudinary from "./cloudinary";

export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId);
}