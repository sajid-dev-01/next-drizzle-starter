import { DEFAULT_LOGIN_REDIRECT } from "@/constants";
import { createSession } from "@/lib/session";
import { loginWithMagicLink } from "@/services/authService";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sign-in",
        },
      });
    }

    const user = await loginWithMagicLink(token);

    await createSession(user.id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: DEFAULT_LOGIN_REDIRECT,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sign-in/magic/error",
      },
    });
  }
}
