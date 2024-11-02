import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";
import { Account, UserID } from "@/types";

export async function createAccount(data: Omit<Account, "id">) {
  const [account] = await db.insert(dbTable.accounts).values(data).returning();

  return account;
}

export async function createOAuthAccount({
  userId,
  provider,
  providerAccountId,
}: {
  userId: UserID;
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

export async function getAccountByUserId(userId: UserID) {
  const account = await db.query.accounts.findFirst({
    where: eq(dbTable.accounts.userId, userId),
  });

  return account;
}

export async function updateAccount(
  userId: UserID,
  data: Partial<Omit<Account, "id" | "userId">>
) {
  await db
    .update(dbTable.accounts)
    .set(data)
    .where(
      and(
        eq(dbTable.accounts.userId, userId),
        eq(dbTable.accounts.accountType, "email")
      )
    );
}

export async function getAccountByGoogleId(googleId: string) {
  return await db.query.accounts.findFirst({
    where: and(
      eq(dbTable.accounts.provider, "google"),
      eq(dbTable.accounts.providerAccountId, googleId)
    ),
  });
}

export async function getAccountByGithubId(githubId: string) {
  return await db.query.accounts.findFirst({
    where: and(
      eq(dbTable.accounts.provider, "github"),
      eq(dbTable.accounts.providerAccountId, githubId)
    ),
  });
}
