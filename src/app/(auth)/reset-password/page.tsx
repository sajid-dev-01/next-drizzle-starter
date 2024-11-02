"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_URI } from "@/constants";
import { handleActionError } from "@/lib/utils";

import AuthCard from "../_components/AuthCard";
import { resetPasswordAction } from "./actions";
import { ResetPasswordPayload, ResetPasswordSchema } from "./validators";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") ?? "",
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
      headerLabel={
        <h2 className="text-3xl font-semibold">Enter a new Password</h2>
      }
      bottomButtonLabel="Don't have an account?"
      bottomButtonHref={AUTH_URI.signUp}
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
                    <Input
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
                    <Input
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
          </div>
          <LoadingButton type="submit" loading={isPending} className="w-full">
            Change Password
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default ResetPasswordPage;
