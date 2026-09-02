"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

// Manages the product.colors array ({ name, code }[]) as removable swatch chips
export default function ColorsInput({ colors, onChange }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("#111827");

  function addColor() {
    const trimmed = name.trim();
    if (!trimmed) return;

    onChange([...colors, { name: trimmed, code }]);
    setName("");
  }

  function removeColor(index) {
    onChange(colors.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Color name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addColor();
              }
            }}
            placeholder="Nude Beige"
            className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Swatch
          </label>
          <input
            type="color"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-11 w-14 cursor-pointer rounded-lg border border-gray-300 p-1"
          />
        </div>

        <button
          type="button"
          onClick={addColor}
          className="flex h-11 items-center gap-1.5 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {colors.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <span
              key={`${color.name}-${index}`}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-2 pr-3 text-sm"
            >
              <span
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.code }}
              />
              {color.name}
              <button
                type="button"
                onClick={() => removeColor(index)}
                aria-label={`Remove ${color.name}`}
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
