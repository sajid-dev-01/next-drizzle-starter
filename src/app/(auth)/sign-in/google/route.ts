import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

import { env } from "@/env";
import { googleAuth } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const cookie = await cookies();
  //if (!globalGETRateLimit()) {
  //  return new Response("Too many requests", {
  //    status: 429
  //  });
  //}

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = googleAuth.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  cookie.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  cookie.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: { Location: url.toString() },
  });
}
