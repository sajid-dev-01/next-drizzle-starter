import "server-only";

import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { cookies, headers } from "next/headers";
import { userAgent } from "next/server";

import { env } from "@/env";
import {
  deleteSession,
  deleteSessionByUserId,
  findSessionById,
  insertSession,
  updateSession,
} from "@/repositories/sessions";
import { findUser } from "@/repositories/users";
import { Session, User, UserID } from "@/types";

export const SESSION_COOKIE_NAME = "session";
const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15;
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2;

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

function generateSessionToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);

  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookie = await cookies();

  cookie.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

async function deleteSessionTokenCookie() {
  const cookie = await cookies();

  cookie.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function getSessionToken() {
  const cookie = await cookies();
  return cookie.get(SESSION_COOKIE_NAME)?.value;
}

export async function createSession(userId: UserID) {
  const token = generateSessionToken();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const header = await headers();

  const session = await insertSession({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
    ipAddress: header.get("X-Forwarded-For"),
    userAgent: userAgent({ headers: header }),
  });

  await setSessionTokenCookie(token, session.expiresAt);
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const sessionInDb = await findSessionById(sessionId);

  if (!sessionInDb) {
    return { session: null, user: null };
  }

  if (Date.now() >= sessionInDb.expiresAt.getTime()) {
    await deleteSession(sessionInDb.id);
    return { session: null, user: null };
  }

  const user = await findUser(sessionInDb.userId);

  if (!user) {
    await deleteSession(sessionInDb.id);
    return { session: null, user: null };
  }

  if (
    Date.now() >=
    sessionInDb.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    sessionInDb.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await updateSession(sessionInDb.id, { expiresAt: sessionInDb.expiresAt });
  }

  return { session: sessionInDb, user };
}

export async function invalidateSession(sessionId: string) {
  deleteSessionTokenCookie();
  await deleteSession(sessionId);
}

export async function invalidateUserSession(userId: UserID) {
  deleteSessionTokenCookie();
  await deleteSessionByUserId(userId);
}
