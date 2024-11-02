import "server-only";

import { createServerActionProcedure, ZSAError } from "zsa";

import { env } from "@/env";
import { validateCurrentRequest } from "@/lib/auth";
import {
  ApplicationError,
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";

function shapeErrors({ err }: any) {
  if (err instanceof ValidationError) {
    return {
      name: "ValidationError",
      message: err.message,
      fieldErrors: err.fieldErrors,
    } as const;
  }

  if (err instanceof ZSAError && err.inputParseErrors?.fieldErrors) {
    return {
      name: "ValidationError",
      message: "Validation failed!",
      fieldErrors: err.inputParseErrors.fieldErrors,
    } as const;
  }

  const isAllowedError = err instanceof ApplicationError;
  const isDev = env.NODE_ENV === "development";

  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err.code ?? "ERROR",
      message: err.message,
    } as const;
  } else {
    return {
      code: "ERROR",
      message: "Something went wrong",
    } as const;
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const session = await validateCurrentRequest();

    if (!session) {
      throw new AuthenticationError();
    }

    return session;
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    return { user: undefined };
  });
