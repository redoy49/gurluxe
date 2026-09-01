export default function ProductGallery({ product, changeImage }) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const mainImage = images[0];

  return (
    // বাম পাশ: প্রডাক্ট ইমেজ গ্যালারি
    <div className="lg:col-span-6 lg:sticky lg:top-24 flex flex-col lg:flex-row-reverse gap-3 items-start">
      {/* মেইন ইমেজ */}
      <div className="relative rounded-sm overflow-hidden bg-white border border-slate-100 shadow-xs aspect-[2/2.5] max-h-[600px] group w-full flex-1">
        {mainImage ? (
          <img
            id="mainProductImage"
            src={mainImage.url}
            alt={mainImage.alt || product?.name || ""}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-sm"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
            <i className="fa-solid fa-image text-4xl"></i>
          </div>
        )}
      </div>

      {/* থাম্বনেইল লিস্ট */}
      {images.length > 1 && (
        <div className="flex lg:flex-col items-center justify-start gap-2 overflow-x-auto custom-scrollbar shrink-0 w-full lg:w-auto pb-1 lg:pb-0">
          {images.map((image, index) => (
            <button
              key={image.url || index}
              type="button"
              onClick={(e) => changeImage(image.url, e.currentTarget)}
              className={`thumb-btn w-[72px] h-20 sm:w-20 sm:h-24 rounded-sm border-2 ${
                index === 0
                  ? "border-pink-600"
                  : "border-transparent hover:border-slate-300"
              } overflow-hidden shrink-0 transition-all focus:outline-none cursor-pointer bg-white shadow-2xs`}
            >
              <img
                src={image.url}
                alt={image.alt || `${product?.name || ""} ${index + 1}`}
                className="w-full h-full object-cover rounded-sm"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
