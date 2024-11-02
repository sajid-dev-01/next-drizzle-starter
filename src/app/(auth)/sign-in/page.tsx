"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { AUTH_URI, DEFAULT_LOGIN_REDIRECT } from "@/constants";
import { handleActionError } from "@/lib/utils";

import AuthCard from "../_components/AuthCard";
import { signInAction } from "./actions";
import { LoginPayload, LoginSchema } from "./validators";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "test@test.com",
      password: "123456",
    },
  });

  const { execute, isPending } = useAction(signInAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: ({ data }) => {
      toast.success("Login successfull!");

      const callbackUrl = searchParams.get("callback-url");

      router.push(callbackUrl ?? DEFAULT_LOGIN_REDIRECT);
    },
  });

  return (
    <AuthCard
      headerLabel={
        <>
          <h2 className="text-3xl font-semibold">Login to {config.appName}</h2>
          <p className="text-muted-foreground text-sm">
            Choose your preferred sign in method
          </p>
        </>
      }
      bottomButtonLabel="Don't have an account?"
      bottomButtonHref={AUTH_URI.signUp}
      showSocial
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="h-auto p-0 font-normal text-blue-500"
                    >
                      <Link href={AUTH_URI.forgotPassword}>
                        Forgot password?
                      </Link>
                    </Button>
                  </div>
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
            Login
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginPage;
