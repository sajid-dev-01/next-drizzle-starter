import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";

export async function getToken(token: string, type: dbTable.VerificationType) {
  return await db.query.verifications.findFirst({
    where: and(
      eq(dbTable.verifications.token, token),
      eq(dbTable.verifications.type, type)
    ),
  });
}

export async function getTokenByEmail(
  email: string,
  type: dbTable.VerificationType
) {
  return await db.query.verifications.findFirst({
    where: and(
      eq(dbTable.verifications.email, email),
      eq(dbTable.verifications.type, type)
    ),
  });
}

export async function insertToken({
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

export async function deleteToken(
  email: string,
  type: dbTable.VerificationType
) {
  await db
    .delete(dbTable.verifications)
    .where(
      and(
        eq(dbTable.verifications.email, email),
        eq(dbTable.verifications.type, type)
      )
    );
}
