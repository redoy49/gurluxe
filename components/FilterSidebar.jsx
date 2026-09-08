"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants/categories";
import { PRICE_RANGES, AVAILABILITY_OPTIONS } from "@/lib/constants/filters";

function toggleInList(current, value) {
  const list = current ? current.split(",").filter(Boolean) : [];
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategories = searchParams.get("category")?.split(",").filter(Boolean) || [];
  const activePrices = searchParams.get("price")?.split(",").filter(Boolean) || [];
  const activeAvailability = searchParams.get("availability")?.split(",").filter(Boolean) || [];

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activePrices.length > 0 ||
    activeAvailability.length > 0;

  function updateParam(key, values) {
    const params = new URLSearchParams(searchParams.toString());

    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }

    // Any filter change resets pagination back to page 1.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("price");
    params.delete("availability");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2b1d28]">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-gray-400 hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="border-b border-gray-100 pb-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Category
        </h3>

        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={activeCategories.includes(category.slug)}
                onChange={() =>
                  updateParam("category", toggleInList(searchParams.get("category"), category.slug))
                }
              />
              <span className="font-sans text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 py-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Price Range
        </h3>

        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={activePrices.includes(range.id)}
                onChange={() =>
                  updateParam("price", toggleInList(searchParams.get("price"), range.id))
                }
              />
              <span className="font-sans text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Availability
        </h3>

        <div className="space-y-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={activeAvailability.includes(option.id)}
                onChange={() =>
                  updateParam(
                    "availability",
                    toggleInList(searchParams.get("availability"), option.id),
                  )
                }
              />
              <span className="font-sans text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
