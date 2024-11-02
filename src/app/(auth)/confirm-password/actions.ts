"use server";

import { authActionClient } from "@/lib/safe-action";
import { confirmPassword } from "@/services/authService";

import { ConfirmPasswordSchema } from "./validators";

export const confirmPassAction = authActionClient
  .metadata({ actionName: "confirmPassAction" })
  .schema(ConfirmPasswordSchema)
  .action(async ({ ctx, parsedInput }) => {
    await confirmPassword({
      sessionId: ctx.session.id,
      password: parsedInput.password,
    });
  });
