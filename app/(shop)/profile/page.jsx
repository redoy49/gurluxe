import { Package, Wallet, CalendarDays } from "lucide-react";
import { requireUserPage } from "@/lib/auth/authorize";
import { getAccountOverview } from "@/lib/queries/account";
import AccountShell from "@/components/account/AccountShell";
import ProfileForm from "@/components/account/ProfileForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const user = await requireUserPage();
  const { profile, stats } = await getAccountOverview(user.id, user.email);

  return (
    <AccountShell user={profile}>
      <div className="grid gap-6 sm:grid-cols-3">
        <StatTile icon={Package} label="Total Orders" value={stats.totalOrders} />
        <StatTile
          icon={Wallet}
          label="Total Spent"
          value={`৳ ${stats.totalSpent.toLocaleString()}`}
        />
        <StatTile
          icon={CalendarDays}
          label="Member Since"
          value={formatDate(profile.joinedAt)}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your name and phone number.
          </p>
          <div className="mt-6">
            <ProfileForm profile={profile} />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            {profile.hasPassword
              ? "Change your account password."
              : "You signed in with Google — no password to manage."}
          </p>
          <div className="mt-6">
            {profile.hasPassword ? (
              <ChangePasswordForm />
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                Your account is linked to Google sign-in, so there&apos;s no
                password stored for it here.
              </div>
            )}
          </div>
        </section>
      </div>
    </AccountShell>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 truncate text-lg font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
