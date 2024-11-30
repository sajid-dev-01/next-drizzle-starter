import * as dbTables from "./db/schema";

export type TableID = string;

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? RecursivelyReplaceNullWithUndefined<U>[]
    : T extends Record<string, unknown>
      ? { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }
      : T;

export type User = typeof dbTables.users.$inferSelect;
export type Account = typeof dbTables.accounts.$inferSelect;
export type Totp = typeof dbTables.totps.$inferSelect;
export type Session = typeof dbTables.sessions.$inferSelect;
