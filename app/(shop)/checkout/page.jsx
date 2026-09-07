import { getStoreSettings } from "@/lib/queries/settings";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return <CheckoutClient settings={settings} />;
}
