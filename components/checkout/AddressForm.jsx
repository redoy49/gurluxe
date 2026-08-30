"use client";

const districts = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export default function AddressForm({
  formData,
  onChange,
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Delivery Information
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          We wll use this information to deliver your order.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-medium text-gray-700"
          >
            Full Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter your full name"
            autoComplete="name"
            className="h-12 w-full rounded-full border border-gray-300 px-5 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-xs font-medium text-gray-700"
          >
            Phone Number
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={formData.phone}
            onChange={onChange}
            placeholder="01XXXXXXXXX"
            autoComplete="tel"
            className="h-12 w-full rounded-full border border-gray-300 px-5 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* District */}
        <div>
          <label
            htmlFor="district"
            className="mb-2 block text-xs font-medium text-gray-700"
          >
            District
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={onChange}
            className="h-12 w-full rounded-full border border-gray-300 bg-white px-5 text-sm outline-none transition focus:border-black"
          >
            <option value="">Select District</option>

            {districts.map((district) => (
              <option
                key={district}
                value={district}
              >
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-xs font-medium text-gray-700"
          >
            Delivery Address
            <span className="ml-1 text-red-500">*</span>
          </label>

          <textarea
            id="address"
            name="address"
            rows={4}
            value={formData.address}
            onChange={onChange}
            placeholder="House, Road, Area, Thana"
            autoComplete="street-address"
            className="w-full resize-none rounded-2xl border border-gray-300 p-4 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium text-gray-700"
          >
            Email
            <span className="ml-1 text-gray-400">
              (Optional)
            </span>
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="example@email.com"
            autoComplete="email"
            className="h-12 w-full rounded-full border border-gray-300 px-5 text-sm outline-none transition focus:border-black"
          />
        </div>
      </div>
    </section>
  );
}