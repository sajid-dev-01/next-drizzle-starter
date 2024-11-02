"use server";

import { authActionClient } from "@/lib/safe-action";
import { invalidateUserSession } from "@/lib/session";

export const signOutAction = authActionClient
  .metadata({ actionName: "signOutAction" })
  .action(async ({ ctx }) => {
    await invalidateUserSession(ctx.user.id);
  });
