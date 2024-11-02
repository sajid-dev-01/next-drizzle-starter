"use server";

import { rateLimitByKey } from "@/lib/rate-limiter";
import { actionClient } from "@/lib/safe-action";
import { signUpUser } from "@/services/authService";

import { RegisterSchema } from "./validators";

export const signUpAction = actionClient
  .metadata({ actionName: "signUpAction" })
  .schema(RegisterSchema)
  .action(async ({ parsedInput: input }) => {
    await rateLimitByKey({ key: "register", limit: 3, window: 10000 });

    await signUpUser(input);
  });
