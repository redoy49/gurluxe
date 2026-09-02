"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

// Manages the product.sizes array (string[]) as removable chips
export default function SizesInput({ sizes, onChange }) {
  const [value, setValue] = useState("");

  function addSize() {
    const trimmed = value.trim().toUpperCase();
    if (!trimmed || sizes.includes(trimmed)) return;

    onChange([...sizes, trimmed]);
    setValue("");
  }

  function removeSize(size) {
    onChange(sizes.filter((s) => s !== size));
  }

  return (
    <div>
      <div className="flex items-end gap-3">
        <div className="max-w-xs flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Size
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSize();
              }
            }}
            placeholder="S, M, L, XL..."
            className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>

        <button
          type="button"
          onClick={addSize}
          className="flex h-11 items-center gap-1.5 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {sizes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-2 text-sm font-medium"
            >
              {size}
              <button
                type="button"
                onClick={() => removeSize(size)}
                aria-label={`Remove ${size}`}
                className="text-gray-400 transition hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
