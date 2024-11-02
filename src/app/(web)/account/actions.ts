"use server";

import { AuthenticationError } from "@/lib/errors";
import { authActionClient } from "@/lib/safe-action";
import { updateUser } from "@/repositories/users";
import { validatePassword } from "@/services/authService";

import {
  updateAccountSchema,
  updateAppearanceSchema,
  updateNotificationSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "./validators";

export const updateAccountActions = authActionClient
  .metadata({ actionName: "updateAccountActions" })
  .schema(updateAccountSchema)
  .action(async ({ ctx }) => {
    //const user = ctx.user;
  });

export const updateAppearanceActions = authActionClient
  .metadata({ actionName: "updateAppearanceActions" })
  .schema(updateAppearanceSchema)
  .action(async ({ ctx }) => {
    //const user = ctx.user;
  });

export const updateNotificationActions = authActionClient
  .metadata({ actionName: "updateNotificationActions" })
  .schema(updateNotificationSchema)
  .action(async ({ ctx }) => {
    //const user = ctx.user;
  });

export const updatePasswordAction = authActionClient
  .metadata({ actionName: "updatePasswordAction" })
  .schema(updatePasswordSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;
    const isValid = await validatePassword({
      email: user.email,
      password: input.currentPassword,
    });

    if (!isValid) throw new AuthenticationError();

    await updateUser(user.id, { password: input.password });
  });

export const updateProfileAction = authActionClient
  .metadata({ actionName: "updateProfileAction" })
  .schema(updateProfileSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;

    await updateUser(user.id, input);
  });
