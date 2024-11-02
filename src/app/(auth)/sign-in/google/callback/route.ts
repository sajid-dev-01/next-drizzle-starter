import { ObjectParser } from "@pilcrowjs/object-parser";
import { decodeIdToken, OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

import { googleAuth } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { getAccountByGoogleId } from "@/repositories/accounts";
import { createGoogleUser } from "@/services/userService";

export async function GET(request: Request): Promise<Response> {
  const cookie = await cookies();
  //if (!globalGETRateLimit()) {
  //  return new Response("Too many requests", {
  //    status: 429
  //  });
  //}
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookie.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookie.get("google_code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);
  const googleId = claimsParser.getString("sub");
  const existingAccount = await getAccountByGoogleId(googleId);

  if (existingAccount) {
    await createSession(existingAccount.userId);

    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }

  const name = claimsParser.getString("name");
  const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");
  const user = await createGoogleUser({ email, name, picture, sub: googleId });

  await createSession(user.id);

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}
