import * as z from "zod";

export const ConfirmPasswordSchema = z
  .object({
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type ConfirmPasswordPayload = z.infer<typeof ConfirmPasswordSchema>;
