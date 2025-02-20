import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";

export async function getVerifyTokenByEmail(
  email: string,
  type: dbTable.VerificationType
) {
  return db.query.verifications.findFirst({
    where: and(
      eq(dbTable.verifications.email, email),
      eq(dbTable.verifications.type, type)
    ),
  });
}

export async function upsertToken({
  email,
  expiresAt,
  token,
  type,
}: {
  email: string;
  token: string;
  expiresAt: Date;
  type: dbTable.VerificationType;
}) {
  const [res] = await db
    .insert(dbTable.verifications)
    .values({ email, type, expiresAt, token })
    .returning()
    .onConflictDoUpdate({
      target: dbTable.verifications.email,
      set: { type, token, expiresAt },
    })
    .returning();
  return res;
}

export async function insertVerifyToken({
  email,
  expiresAt,
  token,
  type,
}: {
  email: string;
  token: string;
  expiresAt: Date;
  type: dbTable.VerificationType;
}) {
  const [res] = await db
    .insert(dbTable.verifications)
    .values({ email, type, expiresAt, token })
    .returning();
  return res;
}

export async function deleteVerifyToken(
  email: string,
  type: dbTable.VerificationType
) {
  return db
    .delete(dbTable.verifications)
    .where(
      and(
        eq(dbTable.verifications.email, email),
        eq(dbTable.verifications.type, type)
      )
    );
}
