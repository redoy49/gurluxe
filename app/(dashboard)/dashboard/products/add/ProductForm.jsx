"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema } from "@/lib/validations/product.schema";
import { addProduct } from "./action";

export default function ProductForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),

    defaultValues: {
      category: {
        name: "Sling Bags",
        slug: "sling-bags",
      },

      colors: "",
      materials: "",

      featured: false,
      newArrival: false,
      bestSeller: false,
    },
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await addProduct(data);

      if (result.success) {
        alert("Product added successfully");

        reset();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Basic Information</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Product Name"
            placeholder="Eve Micro Bag"
            register={register("name")}
            error={errors.name?.message}
          />

          <Field
            label="Slug"
            placeholder="eve-micro-bag"
            register={register("slug")}
            error={errors.slug?.message}
          />

          <Field
            label="SKU"
            placeholder="EVE-001"
            register={register("sku")}
            error={errors.sku?.message}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>

            <select
              className="h-11 w-full rounded-lg border px-4"
              onChange={(e) => {
                const name = e.target.value;

                setValue(
                  "category",

                  {
                    name,

                    slug: name.toLowerCase().replaceAll(" ", "-"),
                  },
                );
              }}
            >
              <option value="Sling Bags">Sling Bags</option>

              <option value="Tote Bags">Tote Bags</option>

              <option value="Clutches">Clutches</option>

              <option value="Satchel Bags">Satchel Bags</option>

              <option value="Crossbody Bags">Crossbody Bags</option>

              <option value="Hand Bags">Hand Bags</option>
            </select>
          </div>

          <Field
            label="Stock"
            type="number"
            placeholder="25"
            register={register("stock")}
            error={errors.stock?.message}
          />
        </div>
      </div>

      {/* Pricing */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Pricing</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Price"
            type="number"
            placeholder="2499"
            register={register("price")}
            error={errors.price?.message}
          />

          <Field
            label="Compare Price"
            type="number"
            placeholder="3499"
            register={register("comparePrice")}
          />
        </div>
      </div>

      {/* Description */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Description</h2>

        <textarea
          {...register("shortDescription")}
          placeholder="Short product description"
          rows={3}
          className="mb-5 w-full rounded-lg border p-4"
        />

        <textarea
          {...register("description")}
          placeholder="Detailed product description"
          rows={6}
          className="w-full rounded-lg border p-4"
        />
      </div>

      {/* Product Details */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Product Details</h2>

        <Field
          label="Colors"
          placeholder="Black, Pink, Brown"
          register={register("colors")}
        />

        <div className="mt-6">
          <Field
            label="Materials"
            placeholder="PU Leather, Canvas"
            register={register("materials")}
          />
        </div>
      </div>

      {/* Product Flags */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Product Type</h2>

        <Check label="Featured Product" register={register("featured")} />

        <Check label="New Arrival" register={register("newArrival")} />

        <Check label="Best Seller" register={register("bestSeller")} />
      </div>

      {/* Media */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Images & Video</h2>

        {/* Cloudinary integration later */}

        <input type="file" disabled className="w-full rounded-lg border p-3" />
      </div>

      {/* Submit */}

      <div className="flex justify-end">
        <button
          disabled={isPending}
          className="rounded-lg bg-black px-8 py-3 font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,

  placeholder,

  type = "text",

  register,

  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="h-11 w-full rounded-lg border px-4 outline-none focus:border-black"
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function Check({
  label,

  register,
}) {
  return (
    <label className="mb-3 flex items-center gap-3">
      <input type="checkbox" {...register} />

      <span>{label}</span>
    </label>
  );
}
