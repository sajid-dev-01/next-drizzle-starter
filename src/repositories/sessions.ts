import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";
import { TableID } from "@/types";

export async function insertSession(
  data: typeof dbTable.sessions.$inferInsert
) {
  const [res] = await db.insert(dbTable.sessions).values(data).returning();
  return res;
}

export async function findSessionById(id: TableID) {
  return db.query.sessions.findFirst({
    where: eq(dbTable.sessions.id, id),
  });
}

export async function findSessionByUserId(userId: TableID) {
  return db.query.sessions.findFirst({
    where: eq(dbTable.sessions.userId, userId),
  });
}

export async function updateSession(
  id: TableID,
  data: Partial<typeof dbTable.sessions.$inferInsert>
) {
  return db
    .update(dbTable.sessions)
    .set(data)
    .where(eq(dbTable.sessions.id, id));
}

export async function deleteSessionByUserId(userId: TableID) {
  return db.delete(dbTable.sessions).where(eq(dbTable.sessions.userId, userId));
}

export async function deleteSession(id: TableID) {
  return db.delete(dbTable.sessions).where(eq(dbTable.sessions.id, id));
}

export async function deleteSessions(ids: TableID[]) {
  return db.delete(dbTable.sessions).where(inArray(dbTable.sessions.id, ids));
}
