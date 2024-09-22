import { drizzle } from "drizzle-orm/postgres-js";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema"; // where our db tables are defined

// Fix for "sorry, too many clients already" from:
// https://www.answeroverflow.com/m/1146224610002600067

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  const client = postgres(process.env.DATABASE_URL || "");

  db = drizzle(client, {
    schema,
  });
} else {
  if (!global.db) {
    const client = postgres(process.env.DATABASE_URL || "");

    global.db = drizzle(client, {
      schema,
      logger: {
        logQuery: (query) => {
          // to remove quotes on query string, to make it more readable
          console.log({ query: query.replace(/\"/g, "") });
        },
      },
    });
  }

  db = global.db;
}

type DbInstance = typeof db;

export { db };
export type { DbInstance };
