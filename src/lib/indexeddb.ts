import { openDB } from "idb";

export async function getDB() {
  if (typeof window === "undefined") {
    return null;
  }

  return openDB("portfolio-db", 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("hero")) {
        db.createObjectStore("hero");
      }

      if (!db.objectStoreNames.contains("about")) {
        db.createObjectStore("about");
      }

      if (!db.objectStoreNames.contains("timeline")) {
        db.createObjectStore("timeline");
      }
    },
  });
}