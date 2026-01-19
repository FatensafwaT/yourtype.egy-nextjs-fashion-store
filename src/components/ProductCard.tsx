import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-3xl border bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.99]"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1 text-gray-500">
        <p className="text-xs text-gray-500">{product.category}</p>
        <h3 className="font-medium leading-snug">{product.name}</h3>
        <p className="font-semibold text-pink-500">{product.price} EGP</p>
      </div>

      {/* Colors */}
      <div className="mt-2 flex gap-1.5">
        {product.colors.slice(0, 4).map((color) => (
          <span
            key={color}
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: color }}
          />
        ))}
        {product.colors.length > 4 && (
          <span className="text-xs text-gray-400">
            +{product.colors.length - 4}
          </span>
        )}
      </div>
    </Link>
  );
}
