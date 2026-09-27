import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE = "zone10_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "zone10-secret";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "zone10admin";
}

export function makeToken() {
  return createHmac("sha256", secret()).update("admin-session").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  return !!token && token === makeToken();
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
