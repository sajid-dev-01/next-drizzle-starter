"use server";

import { rateLimitByKey } from "@/lib/rate-limiter";
import { actionClient } from "@/lib/safe-action";
import { changePassword } from "@/services/authService";

import { ResetPasswordSchema } from "./validators";

export const resetPasswordAction = actionClient
  .metadata({ actionName: "resetPasswordAction" })
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: input }) => {
    await rateLimitByKey({ key: "change-password", limit: 2, window: 10000 });

    await changePassword(input);
  });
