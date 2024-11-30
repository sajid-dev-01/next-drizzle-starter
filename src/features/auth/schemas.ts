import * as z from "zod";

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6),
});
export type SignInPayload = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export type SignUpPayload = z.infer<typeof SignUpSchema>;

export const VerifyEmailSchema = z.object({
  otp: z.string().min(6),
});
export type VerifyEmailPayload = z.infer<typeof VerifyEmailSchema>;

export const ResetPasswordSchema = z
  .object({
    otp: z.string(),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });
export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;

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
