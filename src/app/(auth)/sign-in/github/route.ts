import { generateState } from "arctic";
import { cookies } from "next/headers";

import { env } from "@/env";
import { githubAuth } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const cookie = await cookies();
  //if (!globalGETRateLimit()) {
  //  return new Response("Too many requests", {
  //    status: 429
  //  });
  //}

  const state = generateState();
  const url = githubAuth.createAuthorizationURL(state, ["user:email"]);

  cookie.set("github_oauth_state", state, {
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
