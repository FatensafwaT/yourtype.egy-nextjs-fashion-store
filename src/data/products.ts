export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: "Tops" | "Dresses" | "Pants" | "Accessories";
  colors: string[];
  sizes: string[];
  image: string;
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
    image:
      "https://images.unsplash.com/photo-1520975958225-4a3a7b6b6a3d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    name: "Mint Cozy Cardigan",
    slug: "mint-cozy-cardigan",
    price: 799,
    category: "Tops",
    colors: ["#B8F2E6", "#FAE1DD"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1520975620134-82d4f7f1c6e6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    name: "Pink Pleated Skirt",
    slug: "pink-pleated-skirt",
    price: 650,
    category: "Pants",
    colors: ["#FFC8DD", "#FFAFCC"],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1520975869016-8a4b5b9aa6dd?auto=format&fit=crop&w=1200&q=80",
  },
];
