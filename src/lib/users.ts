import { readJson, writeJson } from "@/lib/db/jsondb";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export async function getAllUsers() {
  return readJson<User[]>("users", []);
}

export async function getUserByEmail(email: string) {
  const users = await getAllUsers();
  return users.find((u) => u.email === email) ?? null;
}

export async function userExists(email: string) {
  const users = await getAllUsers();
  return users.some((u) => u.email === email);
}

export async function addUser(user: User) {
  const users = await getAllUsers();
  users.unshift(user);
  await writeJson("users", users);
  return user;
}
