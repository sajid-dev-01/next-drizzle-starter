"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { InputPassword } from "@/components/ui-extension/input-password";
import { handleActionError } from "@/lib/handle-action-error";

import { AUTH_URI } from "../constants";
import { ResetPasswordPayload, ResetPasswordSchema } from "../schemas";
import { resetPasswordAction } from "../server/actions";
import AuthCard from "./auth-card";

const ResetPassword = () => {
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
      password: "test123",
      passwordConfirmation: "test123",
    },
  });

  const { execute, isPending } = useAction(resetPasswordAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess() {
      toast.success("Password changed!");
    },
  });

  return (
    <AuthCard
      headerTitle="Enter a new password"
      buttonLabel="Don't have an account?"
      buttonHref={AUTH_URI.signUp}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => execute(v))}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Confirmation</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP code</FormLabel>
                  <FormControl>
                    <InputOTP {...field} maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ButtonLoading type="submit" loading={isPending} className="w-full">
            Change Password
          </ButtonLoading>
        </form>
      </Form>
    </AuthCard>
  );
};

export default ResetPassword;
