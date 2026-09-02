"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Info,
  ImageIcon,
  Wallet,
  Layers,
  FileText,
  Boxes,
  Star,
  Loader2,
} from "lucide-react";
import { productSchema } from "@/lib/validations/product.schema";
import { generateSlug } from "@/lib/utils/generateSlug";
import ColorsInput from "./product-form/ColorsInput";
import SizesInput from "./product-form/SizesInput";
import ImagesInput from "./product-form/ImagesInput";

const CATEGORIES = [
  "Sling Bags",
  "Tote Bags",
  "Clutches",
  "Satchel Bags",
  "Crossbody Bags",
  "Hand Bags",
];

export default function ProductForm({
  product,
  action,
  submitText = "Save Product",
}) {
  const [isPending, startTransition] = useTransition();
  const [imageFiles, setImageFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      stock: product?.stock || "",
      price: product?.price || "",
      comparePrice: product?.comparePrice || "",
      soldCount: product?.soldCount ?? 0,
      status: product?.status || "active",
      shortDescription: product?.shortDescription || "",
      description: product?.description || "",
      materials: product?.materials || "",

      category: product?.category || {
        name: "Sling Bags",
        slug: "sling-bags",
      },

      colors: product?.colors || [],
      sizes: product?.sizes || [],

      featured: product?.flags?.featured || false,
      newArrival: product?.flags?.newArrival || false,
      bestSeller: product?.flags?.bestSeller || false,
    },
  });

  const name = watch("name");
  const categoryName = watch("category")?.name || "Sling Bags";
  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];

  const onSubmit = (data) => {
    // Images are required for a brand-new product; edits can keep existing ones as-is
    if (!product && imageFiles.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();

      formData.append("product", JSON.stringify(data));

      if (product?._id) {
        formData.append("_id", product._id);
      }

      imageFiles.forEach((file) => formData.append("images", file));

      const result = await action(formData);

      if (result.success) {
        toast.success(result.message);
        if (!product) {
          reset();
          setImageFiles([]);
        }
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Section
        icon={Info}
        title="Basic Information"
        description="The core identity of this product."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Field
              label="Product Name"
              placeholder="Eve Micro Bag"
              register={register("name")}
              error={errors.name?.message}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              URL: /shop/{name ? generateSlug(name) : "your-product-slug"}
            </p>
          </div>

          <Field
            label="SKU"
            placeholder="EVE-001"
            register={register("sku")}
            error={errors.sku?.message}
          />

          <Select
            label="Category"
            value={categoryName}
            onChange={(e) => {
              const categoryOptionName = e.target.value;
              setValue("category", {
                name: categoryOptionName,
                slug: generateSlug(categoryOptionName),
              });
            }}
            options={CATEGORIES}
          />

          <Select
            label="Status"
            register={register("status")}
            options={[
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
      </Section>

      {/* Media */}
      <Section
        icon={ImageIcon}
        title="Media"
        description="Upload product photos. The first image is used as the cover."
      >
        <ImagesInput
          existingImages={product?.images || []}
          files={imageFiles}
          onChange={setImageFiles}
        />
      </Section>

      {/* Pricing & Inventory */}
      <Section
        icon={Wallet}
        title="Pricing & Inventory"
        description="Set the price customers pay and how much stock is available."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Price"
            type="number"
            placeholder="2499"
            register={register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />
          <Field
            label="Compare Price"
            type="number"
            placeholder="3499"
            register={register("comparePrice", { valueAsNumber: true })}
            error={errors.comparePrice?.message}
          />
          <Field
            label="Stock"
            type="number"
            placeholder="25"
            register={register("stock", { valueAsNumber: true })}
            error={errors.stock?.message}
          />
          <Field
            label="Sold Count"
            type="number"
            placeholder="0"
            register={register("soldCount", { valueAsNumber: true })}
            error={errors.soldCount?.message}
          />
        </div>
      </Section>

      {/* Variants */}
      <Section
        icon={Layers}
        title="Variants"
        description="Available colors and sizes customers can choose from."
      >
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">Colors</p>
            <ColorsInput
              colors={colors}
              onChange={(next) =>
                setValue("colors", next, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="mb-3 text-sm font-medium text-gray-700">Sizes</p>
            <SizesInput
              sizes={sizes}
              onChange={(next) =>
                setValue("sizes", next, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>
      </Section>

      {/* Description */}
      <Section
        icon={FileText}
        title="Description"
        description="Tell customers what makes this product worth buying."
      >
        <Textarea
          label="Short Description"
          placeholder="A quick, punchy summary shown near the price"
          rows={3}
          register={register("shortDescription")}
          error={errors.shortDescription?.message}
        />
        <div className="mt-6">
          <Textarea
            label="Full Description"
            placeholder="Detailed product description"
            rows={6}
            register={register("description")}
            error={errors.description?.message}
          />
        </div>
      </Section>

      {/* Materials */}
      <Section
        icon={Boxes}
        title="Materials"
        description="What the product is made of."
      >
        <Field
          label="Materials"
          placeholder="PU Leather"
          register={register("materials")}
        />
      </Section>

      {/* Product Flags */}
      <Section
        icon={Star}
        title="Product Flags"
        description="Control where this product is highlighted in the store."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle
            label="Featured"
            description="Show on featured sections"
            register={register("featured")}
          />
          <Toggle
            label="New Arrival"
            description="Tag as a new arrival"
            register={register("newArrival")}
          />
          <Toggle
            label="Best Seller"
            description="Tag as a best seller"
            register={register("bestSeller")}
          />
        </div>
      </Section>

      {/* Submit */}
      <div className="sticky bottom-0 -mx-1 flex justify-end gap-3 border-t border-gray-200 bg-gray-50/95 px-1 py-4 backdrop-blur-sm">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, placeholder, type = "text", register, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`h-11 w-full rounded-lg border px-4 outline-none transition focus:border-black ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Textarea({ label, placeholder, rows, register, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...register}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:border-black ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Select({ label, register, value, onChange, options }) {
  // options can be plain category names, or { value, label } pairs (e.g. status)
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  // Either an RHF register() binding, or a plain controlled value/onChange pair
  const bindingProps = register || { value, onChange };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        {...bindingProps}
        className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-black"
      >
        {normalized.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, description, register }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3.5 transition hover:border-gray-300">
      <span>
        <span className="block text-sm font-medium text-gray-900">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-gray-500">{description}</span>
        )}
      </span>

      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input type="checkbox" {...register} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-black" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
