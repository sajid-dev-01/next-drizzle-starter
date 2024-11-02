"use server";

import { z } from "zod";

import { actionClient } from "@/lib/safe-action";
import { verifyEmail } from "@/services/authService";

export const verifyEmailAction = actionClient
  .metadata({ actionName: "verifyEmailAction" })
  .schema(z.object({ token: z.string() }))
  .action(async ({ parsedInput: input }) => {
    await verifyEmail(input.token);
  });
