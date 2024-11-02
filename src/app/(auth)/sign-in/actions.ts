"use server";

import { actionClient } from "@/lib/safe-action";
import { createSession } from "@/lib/session";
import { validatePassword } from "@/services/authService";

import { LoginSchema } from "./validators";

export const signInAction = actionClient
  .metadata({ actionName: "signInAction" })
  .schema(LoginSchema)
  .action(async ({ parsedInput }) => {
    const user = await validatePassword(parsedInput);

    if ("id" in user) {
      await createSession(user.id);
    }
  });
