import "server-only";

import { GitHub, Google } from "arctic";
import { cache } from "react";

import { env } from "@/env";

import { getSessionToken, validateSessionToken } from "./session";

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export const githubAuth = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  `${env.NEXT_PUBLIC_APP_URL}/api/login/github/callback`
);

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.NEXT_PUBLIC_APP_URL}/api/login/google/callback`
);

export async function validateRequest() {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { session: null, user: null };
  }
  return validateSessionToken(sessionToken);
}

export const validateCurrentRequest = cache(async () => {
  const res = await validateRequest();

  if (!res.session) return undefined;

  return res;
});
