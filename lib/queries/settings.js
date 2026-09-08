import { dbConnect } from "@/lib/mongoDb";

export const SETTINGS_DOC_ID = "store";

// Fallback configuration used until an admin saves real settings — these are
// the same shipping figures the checkout page originally had hardcoded, now
// centralized so Settings can actually change store behavior.
export const DEFAULT_SETTINGS = {
  storeName: "Gurluxe",
  supportEmail: "",
  supportPhone: "",
  address: "",
  shippingInsideDhaka: 60,
  shippingOutsideDhaka: 120,
  freeShippingThreshold: 0,
  codEnabled: true,
  bkashNumber: "",
  nagadNumber: "",
  rocketNumber: "",
  upayNumber: "",
};

export async function getStoreSettings() {
  const db = await dbConnect();

  const doc = await db
    .collection("settings")
    .findOne({ _id: SETTINGS_DOC_ID });

  if (!doc) return { ...DEFAULT_SETTINGS };

  const { _id, ...settings } = doc;

  return { ...DEFAULT_SETTINGS, ...settings };
}
