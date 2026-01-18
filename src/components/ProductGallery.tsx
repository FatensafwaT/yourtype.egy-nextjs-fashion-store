"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border bg-white shadow-sm">
        <Image
          src={active}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 3).map((img) => {
          const isActive = img === active;
          return (
            <button
              key={img}
              onClick={() => setActive(img)}
              className={[
                "relative aspect-square overflow-hidden rounded-2xl border bg-white transition",
                isActive ? "ring-2 ring-pink-300" : "hover:shadow-sm",
              ].join(" ")}
              aria-label="thumbnail"
              type="button"
            >
              <Image src={img} alt="" fill className="object-cover opacity-95" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
