"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { handleActionError } from "@/lib/handle-action-error";

import { AUTH_URI } from "../constants";
import { ForgotPasswordPayload, ForgotPasswordSchema } from "../schemas";
import { forgotPasswordAction } from "../server/actions";
import AuthCard from "./auth-card";

const ForgotPassword = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "test@test.com",
    },
  });

  const { execute, isPending } = useAction(forgotPasswordAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      router.push(`${AUTH_URI.resetPassword}?email=${form.getValues("email")}`);
    },
  });

  return (
    <AuthCard
      headerTitle="Forgot your password?"
      buttonLabel="Back to login"
      buttonHref={AUTH_URI.signIn}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => execute(v))}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ButtonLoading type="submit" loading={isPending} className="w-full">
            Send reset link
          </ButtonLoading>
        </form>
      </Form>
    </AuthCard>
  );
};

export default ForgotPassword;
