"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

// Handles new image selection/previews; existingImages (edit mode) are shown read-only
// since they're already persisted in Cloudinary/MongoDB and are preserved on save.
export default function ImagesInput({ existingImages = [], files, onChange }) {
  const inputRef = useRef(null);

  // Derive preview URLs from the selected files; only revoke them as cleanup
  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function handleSelect(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length) onChange([...files, ...selected]);
    e.target.value = "";
  }

  function removeFile(index) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      {existingImages.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Current images
          </p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((image) => (
              <img
                key={image.publicId}
                src={image.url}
                alt=""
                className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-500 transition hover:border-black hover:text-black"
      >
        <ImagePlus size={22} />
        <span className="text-sm font-medium">Click to upload images</span>
        <span className="text-xs text-gray-400">
          PNG or JPG, multiple files supported
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div key={src} className="group relative h-20 w-20">
              <img
                src={src}
                alt=""
                className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                aria-label="Remove image"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-red-500"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
