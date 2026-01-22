import { promises as fs } from "fs";
import path from "path";


export type DBName = "users" | "orders" | "cart" | "wishlist";

function filePath(name: DBName) {
  return path.join(process.cwd(), "src", "lib", "db", `${name}.json`);
}

export async function readJson<T>(
  name: DBName,
  fallback: T,
): Promise<T> {
  try {
    const data = await fs.readFile(filePath(name), "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(
  name: DBName,
  data: T,
) {
  await fs.writeFile(
    filePath(name),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}
