import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import ProductOptions from "@/components/ProductOptions";
import ProductGallery from "@/components/ProductGallery";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="font-medium">Product not found.</p>
        <Link
          href="/products"
          className="mt-3 inline-block text-pink-500 hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link href="/products" className="hover:underline">
          Shop
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500">{product.category}</p>

            <h1 className="mt-1 text-3xl font-semibold leading-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-xl font-semibold text-pink-500">
              {product.price} EGP
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span className="rounded-full bg-pink-50 px-3 py-1">New</span>
              <span className="rounded-full bg-purple-50 px-3 py-1">
                Pastel
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1">
                In stock
              </span>
            </div>
          </div>

          {/* Variant box */}
          <ProductOptions
            colors={product.colors}
            sizes={product.sizes}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
            }}
          />

          {/* Description */}
          <div className="rounded-3xl border bg-white p-5 text-gray-700 shadow-sm">
            <p className="text-sm font-medium">Description</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A cute pastel essential with comfy fabric and sweet details —
              perfect for everyday styling. Pair it with your favorite skirt or
              jeans for a soft, confident look.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-[#fffafc] p-3">
                <p className="text-gray-500">Material</p>
                <p className="font-medium">Soft cotton blend</p>
              </div>
              <div className="rounded-2xl bg-[#fffafc] p-3">
                <p className="text-gray-500">Care</p>
                <p className="font-medium">Gentle wash</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
