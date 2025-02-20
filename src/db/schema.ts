import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { userAgent } from "next/server";

export type VerificationType = "email" | "magic-link";
export type AccountType = "email" | "oidc" | "oauth" | "webauthn";
export type OAuthProvider = "google" | "github" | "facebook";

const timestamp = {
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
};

export const roles = sqliteTable("role", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  permissions: text("permissions", { mode: "json" }).$type<any>(),
  ...timestamp,
});

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roleId: text("roleId").references(() => roles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  emailVerified: integer("emailVerifiedAt", { mode: "timestamp" }),
  isTwoFAEnabled: integer("isTwoFAEnabled", { mode: "boolean" }).default(false),
  image: text("image"),
  ...timestamp,
});

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: text("accountType").$type<AccountType>().notNull(),
    provider: text("provider").$type<OAuthProvider>().notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refreshToken"),
    accessToken: text("accessToken"),
    expiresAt: integer("expiresAt"),
    tokenType: text("tokenType"),
    scope: text("scope"),
    idToken: text("idToken"),
    sessionState: text("sessionState"),
  },
  (account) => ({
    pk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verifications = sqliteTable("verification", {
  email: text("email")
    .references(() => users.email, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),
  type: text("type").$type<VerificationType>().notNull(),
  token: text("token").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent", { mode: "json" }).$type<
    ReturnType<typeof userAgent>
  >(),
  twoFactorVerifiedAt: integer("twoFactorVerifiedAt", { mode: "timestamp" }),
  passwordConfirmedAt: integer("passwordConfirmedAt", { mode: "timestamp" }),
});

export const totps = sqliteTable("totp", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
});
