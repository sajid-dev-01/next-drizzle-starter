import bcrypt from "bcryptjs";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import * as dbTable from "@/db/schema";
import { User, UserID } from "@/types";

export async function insertUser(data: typeof dbTable.users.$inferInsert) {
  let passwordHash = "";

  if (data.password) {
    passwordHash = bcrypt.hashSync(data.password, 10);
  }

  const [user] = await db
    .insert(dbTable.users)
    .values({
      ...data,
      password: passwordHash || undefined,
    })
    .returning();

  return user;
}

export async function insertMagicUser(email: string) {
  const [user] = await db
    .insert(dbTable.users)
    .values({
      name: "",
      email,
      emailVerified: new Date(),
    })
    .returning();

  return user;
}

export async function findUser(userId: UserID) {
  const user = await db.query.users.findFirst({
    where: eq(dbTable.users.id, userId),
  });

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(dbTable.users.email, email),
  });

  return user;
}

export async function findMagicUserAccountByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(dbTable.users.email, email),
  });

  return user;
}

export async function updateUser(
  userId: UserID,
  data: Partial<Omit<User, "id">>
) {
  let passwordHash = "";

  if (data.password) {
    passwordHash = bcrypt.hashSync(data.password, 10);
  }

  await db
    .update(dbTable.users)
    .set({
      ...data,
      password: passwordHash || undefined,
    })
    .where(eq(dbTable.users.id, userId));
}

export async function updateUserByEmail(
  email: string,
  data: Partial<Omit<User, "id" | "email">>
) {
  let passwordHash = "";

  if (data.password) {
    passwordHash = bcrypt.hashSync(data.password, 10);
  }

  await db
    .update(dbTable.users)
    .set({
      ...data,
      password: passwordHash || undefined,
    })
    .where(eq(dbTable.users.email, email));
}

export async function deleteUser(userId: UserID) {
  await db.delete(dbTable.users).where(eq(dbTable.users.id, userId));
}

export async function deleteUsers(userIds: UserID[]) {
  await db.delete(dbTable.users).where(inArray(dbTable.users.id, userIds));
}
