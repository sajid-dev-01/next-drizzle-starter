import { decodeBase32, encodeBase32 } from "@oslojs/encoding";
import { createTOTPKeyURI, verifyTOTP } from "@oslojs/otp";
import qrcode from "qrcode";

import appConfig from "@/configs/app-config";
import { decrypt, encrypt } from "@/lib/encryption";
import { TokenError } from "@/lib/errors";
import {
  deleteTotpByUserId,
  findTotpByUserId,
  insertTotp,
} from "@/repositories/totps";
import { updateUser } from "@/repositories/users";
import { TableID, Totp, User } from "@/types";

export async function saveUserTotpKey(input: Omit<Totp, "id">) {
  const existingTotp = await findTotpByUserId(input.userId);
  if (existingTotp) {
    await deleteTotpByUserId(input.userId);
  }

  return await insertTotp(input);
}

export async function getUserTotpKey(userId: TableID) {
  return await findTotpByUserId(userId);
}

export async function setUpTotp(user: User) {
  const key = new Uint8Array(20);
  crypto.getRandomValues(key);
  const keyURI = createTOTPKeyURI(appConfig.name, user.name, key, 30, 6);
  const [qrImageUrl] = await Promise.all([
    await qrcode.toDataURL(keyURI),
    await saveUserTotpKey({
      userId: user.id,
      key: encodeBase32(encrypt(key)),
    }),
  ]);

  return { key: encodeBase32(key), qrImageUrl };
}

export async function verifyUserTotp(user: User, otp: string) {
  if (user.isTwoFAEnabled) {
    return { message: "2FA is already enabled" };
  }

  const userTotp = await getUserTotpKey(user.id);
  if (!userTotp?.key) {
    return { message: "Totp key not set" };
  }

  const key = decrypt(decodeBase32(userTotp.key));
  if (!verifyTOTP(key, 30, 6, otp)) {
    throw new TokenError("Invalid code. Please try again");
  }

  await updateUser(user.id, { isTwoFAEnabled: true });

  return { message: "2FA setup completed" };
}

export async function disableUserTotp(user: User, otp: string) {
  if (!user.isTwoFAEnabled) {
    return { message: "2FA is not enabled" };
  }

  const userTotp = await getUserTotpKey(user.id);
  if (!userTotp?.key) {
    return { message: "Totp key not set" };
  }

  const key = decrypt(decodeBase32(userTotp.key));
  if (!verifyTOTP(key, 30, 6, otp)) {
    throw new TokenError("Invalid code. Please try again");
  }

  await updateUser(user.id, { isTwoFAEnabled: false });

  return { message: "2FA disabled successfully." };
}
