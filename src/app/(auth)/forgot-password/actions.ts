"use server";

import { rateLimitByKey } from "@/lib/rate-limiter";
import { actionClient } from "@/lib/safe-action";
import { forgotPassword } from "@/services/authService";

import { ForgotPasswordSchema } from "./validators";

export const forgotPasswordAction = actionClient
  .metadata({ actionName: "forgotPasswordAction" })
  .schema(ForgotPasswordSchema)
  .action(async ({ parsedInput: input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10000 });

    await forgotPassword(input.email);
  });
