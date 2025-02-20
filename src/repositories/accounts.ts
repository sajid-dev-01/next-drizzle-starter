import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";
import { Account, TableID } from "@/types";

export async function createAccount(data: Omit<Account, "id">) {
  const [res] = await db.insert(dbTable.accounts).values(data).returning();
  return res;
}

export async function createOAuthAccount({
  userId,
  provider,
  providerAccountId,
}: {
  userId: TableID;
  providerAccountId: string;
  provider: dbTable.OAuthProvider;
}) {
  await db
    .insert(dbTable.accounts)
    .values({
      userId: userId,
      accountType: "oauth",
      provider,
      providerAccountId,
    })
    .onConflictDoNothing()
    .returning();
}

export async function getAccountByUserId(userId: TableID) {
  return db.query.accounts.findFirst({
    where: eq(dbTable.accounts.userId, userId),
  });
}

export async function updateAccount(
  userId: TableID,
  data: Partial<Omit<Account, "id" | "userId">>
) {
  return db
    .update(dbTable.accounts)
    .set(data)
    .where(
      and(
        eq(dbTable.accounts.userId, userId),
        eq(dbTable.accounts.accountType, "email")
      )
    );
}

export async function getOauthAccount(
  id: TableID,
  type: dbTable.OAuthProvider
) {
  return db.query.accounts.findFirst({
    where: and(
      eq(dbTable.accounts.provider, type),
      eq(dbTable.accounts.providerAccountId, id)
    ),
  });
}
