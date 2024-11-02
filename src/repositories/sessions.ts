import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";
import { UserID } from "@/types";

export async function insertSession(
  data: typeof dbTable.sessions.$inferInsert
) {
  const [res] = await db.insert(dbTable.sessions).values(data).returning();

  return res;
}

export async function findSessionById(id: string) {
  const res = await db.query.sessions.findFirst({
    where: eq(dbTable.sessions.id, id),
  });

  return res;
}

export async function findSessionByUserId(userId: UserID) {
  const res = await db.query.sessions.findFirst({
    where: eq(dbTable.sessions.userId, userId),
  });

  return res;
}

export async function updateSession(
  id: string,
  data: Partial<typeof dbTable.sessions.$inferInsert>
) {
  await db
    .update(dbTable.sessions)
    .set(data)
    .where(eq(dbTable.sessions.id, id));
}

export async function deleteSessionByUserId(userId: UserID) {
  await db.delete(dbTable.sessions).where(eq(dbTable.sessions.userId, userId));
}

export async function deleteSession(id: string) {
  await db.delete(dbTable.sessions).where(eq(dbTable.sessions.id, id));
}

export async function deleteSessions(ids: string[]) {
  await db.delete(dbTable.sessions).where(inArray(dbTable.sessions.id, ids));
}
