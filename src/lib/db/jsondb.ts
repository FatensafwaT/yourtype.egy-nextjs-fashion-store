import { promises as fs } from "fs";
import path from "path";

function filePath(name: "users" | "orders") {
  return path.join(process.cwd(), "src", "lib", "db", `${name}.json`);
}

export async function readJson<T>(
  name: "users" | "orders",
  fallback: T,
): Promise<T> {
  try {
    const data = await fs.readFile(filePath(name), "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(name: "users" | "orders", data: T) {
  await fs.writeFile(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}
