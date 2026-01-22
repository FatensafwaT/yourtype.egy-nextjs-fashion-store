import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

const CATEGORIES = ["Tops", "Dresses", "Pants", "Accessories"] as const;

const PASTEL_COLORS = [
  "#CDB4DB", // lavender
  "#FFC8DD", // pink
  "#BDE0FE", // baby blue
  "#B8F2E6", // mint
  "#FAE1DD", // peach
  "#E2F0CB", // pistachio
  "#FDE2E4", // blush
  "#E7C6FF", // lilac
  "#D0F4DE", // soft green
  "#FFF1E6", // cream
];

const SIZE_SETS: Record<(typeof CATEGORIES)[number], string[]> = {
  Tops: ["XS", "S", "M", "L", "XL"],
  Dresses: ["XS", "S", "M", "L", "XL"],
  Pants: ["XS", "S", "M", "L", "XL"],
  Accessories: ["One Size"],
};

const NAMES: Record<(typeof CATEGORIES)[number], string[]> = {
  Tops: [
    "Ribbon Top",
    "Cozy Cardigan",
    "Puff Sleeve Blouse",
    "Cropped Hoodie",
    "Knit Tank",
  ],
  Dresses: [
    "Satin Midi Dress",
    "Floral Skater Dress",
    "Wrap Dress",
    "Ruffle Mini Dress",
    "Lace Slip Dress",
  ],
  Pants: [
    "Wide-Leg Pants",
    "Soft Joggers",
    "Pleated Trousers",
    "Denim Straight Jeans",
    "Cargo Pants",
  ],
  Accessories: [
    "Pearl Necklace",
    "Mini Tote Bag",
    "Hair Clips Set",
    "Silk Scrunchies",
    "Heart Earrings",
  ],
};

const ADJECTIVES = [
  "Lavender",
  "Blush",
  "Mint",
  "Sky",
  "Vanilla",
  "Peach",
  "Lilac",
  "Cloud",
  "Rose",
  "Butter",
  "Icy",
  "Soft",
  "Dreamy",
  "Coquette",
  "Pastel",
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// helper: pick deterministic items (عشان كل مرة يطلع نفس التوزيع)
function pick<T>(arr: T[], i: number, offset = 0) {
  return arr[(i + offset) % arr.length];
}

function pickMany<T>(arr: T[], i: number, count: number) {
  const out: T[] = [];
  for (let k = 0; k < count; k++) out.push(arr[(i + k) % arr.length]);
  return Array.from(new Set(out)); // unique
}

async function main() {
 
  await prisma.product.deleteMany();

  const itemsPerCategory = 12; 

  const products = [];

  for (let c = 0; c < CATEGORIES.length; c++) {
    const category = CATEGORIES[c];
    for (let i = 0; i < itemsPerCategory; i++) {
      const adj = pick(ADJECTIVES, i, c * 3);
      const baseName = pick(NAMES[category], i, c * 2);

      const name = `${adj} ${baseName}`;
      const slug = `${slugify(name)}-${category.toLowerCase()}-${i + 1}`;

      
      const basePrice =
        category === "Accessories"
          ? 199
          : category === "Tops"
            ? 499
            : category === "Pants"
              ? 699
              : 899; // Dresses

      const price = basePrice + (i % 6) * 70;

      const colors =
        category === "Accessories"
          ? pickMany(PASTEL_COLORS, i + c, 2)
          : pickMany(PASTEL_COLORS, i + c, 3);

      const sizes = SIZE_SETS[category];

      
      const imgSeed = `${slugify(category)}-${i + 1}-${c + 1}`;
      const images = [
        `https://picsum.photos/seed/${imgSeed}-a/1200/1500`,
        `https://picsum.photos/seed/${imgSeed}-b/1200/1500`,
        `https://picsum.photos/seed/${imgSeed}-c/1200/1500`,
      ];

      products.push({
        name,
        slug,
        price,
        category,
        images: JSON.stringify(images),
        colors: JSON.stringify(colors),
        sizes: JSON.stringify(sizes),
      });
    }
  }

  
  await prisma.product.createMany({ data: products });

  console.log(` Seed completed: inserted ${products.length} products`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
