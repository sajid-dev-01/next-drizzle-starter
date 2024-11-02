import "server-only";

import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";

import { env } from "@/env";

import { validateCurrentRequest } from "./auth";
import {
  ApplicationError,
  AuthenticationError,
  ValidationError,
} from "./errors";

// Base client.
export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(e) {
    console.error("Action error:", e);

    if (e instanceof ValidationError) {
      return {
        name: "ValidationError",
        message: e.message,
        fieldErrors: e.fieldErrors,
      } as const;
    }

    if (e instanceof ApplicationError) {
      return { name: e.name, message: e.message } as const;
    }

    if (env.NODE_ENV === "production") {
      return { code: "ERROR", message: DEFAULT_SERVER_ERROR_MESSAGE } as const;
    }

    return { name: e.name, cause: e.cause, message: e.message } as const;
  },
  defineMetadataSchema() {
    return z.object({ actionName: z.string() });
  },
  // Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const startTime = performance.now();

  // Here we await the action execution.
  const { ctx, parsedInput, ...result } = await next();

  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  // And then return the result of the awaited action.
  return result;
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    const auth = await validateCurrentRequest();

    if (!auth) {
      throw new AuthenticationError();
    }

    // Return the next middleware with `userId` value in the context
    return await next({ ctx: auth });
  });
