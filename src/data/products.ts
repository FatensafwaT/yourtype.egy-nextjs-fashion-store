export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: "Tops" | "Dresses" | "Pants" | "Accessories";
  colors: string[];
  sizes: string[];
  images: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Lavender Ribbon Top",
    slug: "lavender-ribbon-top",
    price: 499,
    category: "Tops",
    colors: ["#CDB4DB", "#FFC8DD", "#BDE0FE"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://picsum.photos/seed/yourtype1/1200/1500",
      "https://picsum.photos/seed/yourtype1b/1200/1500",
      "https://picsum.photos/seed/yourtype1c/1200/1500",
    ],
  },
  {
    id: "2",
    name: "Mint Cozy Cardigan",
    slug: "mint-cozy-cardigan",
    price: 799,
    category: "Tops",
    colors: ["#B8F2E6", "#FAE1DD"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://picsum.photos/seed/yourtype2/1200/1500",
      "https://picsum.photos/seed/yourtype2b/1200/1500",
      "https://picsum.photos/seed/yourtype2c/1200/1500",
    ],
  },
  {
    id: "3",
    name: "Pink Pleated Skirt",
    slug: "pink-pleated-skirt",
    price: 650,
    category: "Pants",
    colors: ["#FFC8DD", "#FFAFCC"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://picsum.photos/seed/yourtype3/1200/1500",
      "https://picsum.photos/seed/yourtype3b/1200/1500",
      "https://picsum.photos/seed/yourtype3c/1200/1500",
    ],
  },
];
