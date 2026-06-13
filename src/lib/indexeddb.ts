import { openDB } from "idb";

export async function getDB() {
  if (typeof window === "undefined") {
    return null;
  }

  return openDB("portfolio-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("hero")) {
        db.createObjectStore("hero");
      }
    },
  });
}