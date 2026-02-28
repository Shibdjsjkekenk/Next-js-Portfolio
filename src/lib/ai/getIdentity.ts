import { buildIdentityText } from "./buildIdentity";

let cachedIdentity: string | null = null;

export async function getIdentityText() {
  if (cachedIdentity) return cachedIdentity;

  cachedIdentity = await buildIdentityText();
  return cachedIdentity;
}