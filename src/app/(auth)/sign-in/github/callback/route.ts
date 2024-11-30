import { ObjectParser } from "@pilcrowjs/object-parser";
import { OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";
import { userAgent } from "next/server";

import { githubAuth } from "@/features/auth/lib/auth";
import { createSession } from "@/services/auth-service";
import {
  createGithubUser,
  getAccountByGithubId,
} from "@/services/user-service";

export async function GET(request: Request): Promise<Response> {
  const cookie = await cookies();
  //if (!globalGETRateLimit()) {
  //  return new Response("Too many requests", {
  //    status: 429
  //  })
  //}
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookie.get("github_oauth_state")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    state !== storedState
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await githubAuth.validateAuthorizationCode(code);
  } catch {
    // Invalid code or client credentials
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const githubAccessToken = tokens.accessToken();
  const userRequest = new Request("https://api.github.com/user");
  userRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);

  const userResponse = await fetch(userRequest);
  const userResult: unknown = await userResponse.json();
  const userParser = new ObjectParser(userResult);
  console.log({ userResult, userParser });
  const githubUserId = userParser.getNumber("id").toString();
  const username = userParser.getString("login");

  const existingAccount = await getAccountByGithubId(githubUserId);

  if (existingAccount) {
    await createSession(existingAccount.userId, {
      ipAddress: request.headers.get("X-Forwarded-For"),
      userAgent: userAgent({ headers: request.headers }),
    });

    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }

  const emailListRequest = new Request("https://api.github.com/user/emails");
  emailListRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);

  const emailListResponse = await fetch(emailListRequest);
  const emailListResult: unknown = await emailListResponse.json();

  if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let email: string | null = null;
  for (const emailRecord of emailListResult) {
    const emailParser = new ObjectParser(emailRecord);
    const primaryEmail = emailParser.getBoolean("primary");
    const verifiedEmail = emailParser.getBoolean("verified");
    if (primaryEmail && verifiedEmail) {
      email = emailParser.getString("email");
    }
  }

  if (email === null) {
    return new Response("Please verify your GitHub email address.", {
      status: 400,
    });
  }

  const user = await createGithubUser({
    email,
    name: username,
    sub: githubUserId,
  });

  await createSession(user.id, {
    ipAddress: request.headers.get("X-Forwarded-For"),
    userAgent: userAgent({ headers: request.headers }),
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}
