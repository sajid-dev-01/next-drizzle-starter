import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";
import { TableID } from "@/types";

export async function insertTotp(data: typeof dbTable.totps.$inferInsert) {
  const [res] = await db.insert(dbTable.totps).values(data).returning();
  return res;
}

export async function findTotp(id: TableID) {
  return db.query.totps.findFirst({
    where: eq(dbTable.totps.id, id),
  });
}

export async function findTotpByUserId(userId: TableID) {
  return db.query.totps.findFirst({
    where: eq(dbTable.totps.userId, userId),
  });
}

export async function deleteTotpByUserId(userId: TableID) {
  return db.delete(dbTable.totps).where(eq(dbTable.totps.userId, userId));
}

export async function deleteTotp(id: TableID) {
  return db.delete(dbTable.totps).where(eq(dbTable.totps.id, id));
}
