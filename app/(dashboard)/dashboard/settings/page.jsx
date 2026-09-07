import { getStoreSettings } from "@/lib/queries/settings";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your store profile, shipping, and payments.
        </p>
      </div>

      <div className="max-w-3xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
