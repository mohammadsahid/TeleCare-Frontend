import { openDB } from "idb";

export const dbPromise =
openDB(
  "health-db",
  1,
  {
    upgrade(db) {

      db.createObjectStore(
        "records",
        {
          keyPath: "_id",
        }
      );

    },
  }
);