"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

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
import { handleActionError } from "@/lib/utils";

import AuthCard from "../_components/AuthCard";
import { confirmPassAction } from "./actions";
import { ConfirmPasswordPayload, ConfirmPasswordSchema } from "./validators";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ConfirmPasswordPayload>({
    resolver: zodResolver(ConfirmPasswordSchema),
    defaultValues: {
      password: "123456",
      passwordConfirmation: "123456",
    },
  });

  const { execute, isPending } = useAction(confirmPassAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      const callbackUrl = searchParams.get("callback-url");

      if (callbackUrl) router.replace(callbackUrl);
    },
  });

  return (
    <AuthCard
      headerLabel={
        <h2 className="text-3xl font-semibold">Confirm your password</h2>
      }
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
            Confirm
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginPage;
