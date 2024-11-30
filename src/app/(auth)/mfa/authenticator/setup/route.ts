import { authenticate } from "@/features/auth/lib/auth";
import { ApplicationError, AuthenticationError } from "@/lib/errors";
import { setUpTotp } from "@/services/totp-service";

export async function GET(): Promise<Response> {
  try {
    const auth = await authenticate();
    if (!auth) throw new AuthenticationError();

    const { key, qrImageUrl } = await setUpTotp(auth.user);

    return Response.json({
      message: "Scan the QR code or use the setup key.",
      key,
      qrImageUrl,
    });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return Response.json(error, { status: 400 });
    }

    return Response.json("server error!", { status: 500 });
  }
}
