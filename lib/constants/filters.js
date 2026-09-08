// Single source of truth for the shop's filter/sort options, shared between
// the filter sidebar (writes these into the URL) and the shop page (reads
// them back out to actually filter/sort the product list).
export const PRICE_RANGES = [
  { id: "0-1000", label: "Under ৳1,000", min: 0, max: 1000 },
  { id: "1001-1500", label: "৳1,001 - ৳1,500", min: 1001, max: 1500 },
  { id: "1501-2000", label: "৳1,501 - ৳2,000", min: 1501, max: 2000 },
  { id: "2001-3000", label: "৳2,001 - ৳3,000", min: 2001, max: 3000 },
  { id: "3001-4000", label: "৳3,001 - ৳4,000", min: 3001, max: 4000 },
  { id: "4001-5000", label: "৳4,001 - ৳5,000", min: 4001, max: 5000 },
  { id: "5001-", label: "Above ৳5,000", min: 5001, max: null },
];

export const AVAILABILITY_OPTIONS = [
  { id: "in", label: "In Stock" },
  { id: "out", label: "Out of Stock" },
];

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "bestselling", label: "Best Selling" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export const SHOP_PAGE_SIZE = 12;
