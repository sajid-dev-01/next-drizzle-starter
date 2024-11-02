import crypto from "crypto";

import config from "@/config";
import { db } from "@/db";
import * as dbTabel from "@/db/schema";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { VerifyEmail } from "@/emails/verify-email";
import { sendEmail } from "@/lib/email";
import { ApplicationError } from "@/lib/errors";
import {
  deleteToken,
  getTokenByEmail,
  insertToken,
} from "@/repositories/tokens";

const TOKEN_LENGTH = 32;
const TOKEN_TTL = 1000 * 60 * 5; // 5 min
const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

async function generateRandomToken(length: number) {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString("hex").slice(0, length);
}

export async function sendPasswordResetTokenEmail(email: string) {
  const existingToken = await getTokenByEmail(email, "reset-tokens");

  if (existingToken) {
    if (existingToken.expiresAt >= new Date()) {
      throw new ApplicationError("Email already sent. Try after a few minutes");
    }

    await deleteToken(email, "reset-tokens");
  }

  // if token not exists or expiresAt, send new verify link
  const token = await generateRandomToken(TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + TOKEN_TTL);
  console.log(token);

  await insertToken({ email, type: "reset-tokens", token, expiresAt });

  await sendEmail(
    email,
    `Your password reset link for ${config.appName}`,
    ResetPasswordEmail({ token })
  );
}

export async function sendVerifyEmail(email: string) {
  const existingToken = await getTokenByEmail(email, "verify-email");

  if (existingToken) {
    if (existingToken.expiresAt >= new Date()) {
      throw new ApplicationError("Email already sent. Try after a few minutes");
    }

    await deleteToken(email, "verify-email");
  }

  // if token not exists or expiresAt, send new verify link
  const token = await generateRandomToken(TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + TOKEN_TTL);
  console.log(token);

  await insertToken({ email, type: "verify-email", token, expiresAt });

  await sendEmail(
    email,
    `Verify your email for ${config.appName}`,
    VerifyEmail({ token })
  );
}

export async function upsertMagicLink(email: string) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + TOKEN_TTL);

  await db
    .insert(dbTabel.verifications)
    .values({
      type: "magic-link",
      email,
      token,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: dbTabel.verifications.email,
      set: {
        type: "magic-link",
        token,
        expiresAt,
      },
    });

  return token;
}
