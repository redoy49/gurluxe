export default function FilterSidebar() {
  return (
    <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-6 text-xl font-semibold text-[#2b1d28]">
        Filters
      </h2>

      {/* Category */}
      <div className="border-b border-gray-100 pb-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Category
        </h3>

        <div className="space-y-2">
          {[
            "Sling Bags",
            "Tote Bags",
            "Crossbody Bags",
            "Clutches",
          ].map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input type="checkbox" />
              <span className="font-sans text-sm">{category}</span>
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
          {[
            "Tk. 1001 - Tk. 1500",
            "Tk. 1501 - Tk. 2000",
            "Tk. 2001 - Tk. 3000",
            "Tk. 3001 - Tk. 4000",
            "Tk. 4001 - Tk. 5000",
          ].map((price) => (
            <label
              key={price}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input type="checkbox" />
              <span className="font-sans text-sm">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className="border-b border-gray-100 py-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Material
        </h3>

        <div className="space-y-2">
          {[
            "Genuine Leather",
            "PU Leather",
            "Canvas",
            "Nylon",
            "Vegan Leather",
          ].map((material) => (
            <label
              key={material}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input type="checkbox" />
              <span className="font-sans text-sm">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="border-b border-gray-100 py-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Colors
        </h3>

        <div className="flex gap-3">
          <button
            type="button"
            className="h-6 w-6 rounded-full bg-black transition hover:scale-110"
          />

          <button
            type="button"
            className="h-6 w-6 rounded-full bg-pink-400 transition hover:scale-110"
          />

          <button
            type="button"
            className="h-6 w-6 rounded-full bg-amber-700 transition hover:scale-110"
          />

          <button
            type="button"
            className="h-6 w-6 rounded-full bg-gray-300 transition hover:scale-110"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="pt-5">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
          Availability
        </h3>

        <div className="space-y-2">
          {["In Stock", "Out of Stock"].map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50"
            >
              <input type="checkbox" />
              <span className="font-sans text-sm">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}