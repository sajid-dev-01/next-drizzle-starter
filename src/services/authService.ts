import bcrypt from "bcryptjs";

import { LoginPayload } from "@/app/(auth)/sign-in/validators";
import { RegisterPayload } from "@/app/(auth)/sign-up/validators";
import {
  ApplicationError,
  AuthenticationError,
  NotFoundError,
  TokenExpiredError,
  ValidationError,
} from "@/lib/errors";
import { findSessionById, updateSession } from "@/repositories/sessions";
import { deleteToken, getToken } from "@/repositories/tokens";
import {
  findUser,
  findUserByEmail,
  insertMagicUser,
  insertUser,
  updateUser,
  updateUserByEmail,
} from "@/repositories/users";

import { sendPasswordResetTokenEmail, sendVerifyEmail } from "./tokenService";

export async function validatePassword(payload: LoginPayload) {
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    throw new ValidationError({ email: ["Email does not exist!"] });
  }

  if (!user.emailVerified) {
    await sendVerifyEmail(email);

    return { success: true, message: "Confirmation email sent!" } as const;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new ApplicationError("Invalid credentials!");
  }

  return user;
}

export async function loginWithMagicLink(token: string) {
  const magicLinkInfo = await getToken(token, "magic-link");

  if (!magicLinkInfo) {
    throw new NotFoundError();
  }

  if (magicLinkInfo.expiresAt! < new Date()) {
    throw new TokenExpiredError();
  }

  const existingUser = await findUserByEmail(magicLinkInfo.email);

  if (existingUser) {
    // await setEmailVerified(existingUser.id);
    await deleteToken(token, "magic-link");

    return existingUser;
  } else {
    const newUser = await insertMagicUser(magicLinkInfo.email);

    await deleteToken(token, "magic-link");

    return newUser;
  }
}

export async function signUpUser({ name, email, password }: RegisterPayload) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    if (existingUser.emailVerified) {
      throw new ValidationError({ email: ["Email is already taken"] });
    }

    await sendVerifyEmail(email);

    return { success: true, message: "Confirmation email sent!" } as const;
  }

  const user = await insertUser({ email, name, password });

  await sendVerifyEmail(email);

  return user;
}

export async function verifyEmail(token: string) {
  const tokenEntry = await getToken(token, "verify-email");

  if (!tokenEntry || tokenEntry.expiresAt <= new Date()) {
    throw new TokenExpiredError();
  }

  await updateUserByEmail(tokenEntry.email, { emailVerified: new Date() });

  await deleteToken(tokenEntry.email, "verify-email");
}

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ValidationError({ email: ["Not exists!"] });
  }

  await sendPasswordResetTokenEmail(email);
}

export async function changePassword({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  const tokenEntry = await getToken(token, "reset-tokens");

  if (!tokenEntry || tokenEntry.expiresAt <= new Date()) {
    throw new TokenExpiredError();
  }

  const user = await findUserByEmail(tokenEntry.email);

  if (!user) throw new NotFoundError();

  await updateUser(user.id, { password });

  await deleteToken(tokenEntry.email, "reset-tokens");
}

export async function confirmPassword({
  sessionId,
  password,
}: {
  sessionId: string;
  password: string;
}) {
  const session = await findSessionById(sessionId);

  if (!session) throw new AuthenticationError();

  const user = await findUser(session.userId);

  if (!user) throw new ApplicationError("Invalid credentials!");

  if (!user.password) return;

  if (!bcrypt.compareSync(password, user.password)) {
    throw new ApplicationError("Invalid credentials!");
  }

  await updateSession(session.id, { passwordConfirmedAt: new Date() });
}
