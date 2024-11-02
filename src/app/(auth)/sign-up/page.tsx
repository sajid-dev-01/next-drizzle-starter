"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";

import LoadingButton from "@/components/LoadingButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { AUTH_URI } from "@/constants";
import { handleActionError } from "@/lib/utils";

import AuthCard from "../_components/AuthCard";
import { signUpAction } from "./actions";
import { RegisterPayload, RegisterSchema } from "./validators";

const RegisterPage = () => {
  const form = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "Sajid",
      email: "test@test.com",
      password: "test123",
    },
  });

  const { execute, isPending, hasSucceeded } = useAction(signUpAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      //toast.success("Login successfull!");
    },
  });

  return (
    <AuthCard
      headerLabel={
        <>
          <h1 className={"text-3xl font-semibold"}>
            Register to {config.appName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Choose your preferred sign up method
          </p>
        </>
      }
      bottomButtonLabel="Already have an account?"
      bottomButtonHref={AUTH_URI.signIn}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Jhon Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          {hasSucceeded && (
            <Alert variant="success">
              <AlertTitle>Email sent!</AlertTitle>
              <AlertDescription>Check your email to confirm.</AlertDescription>
            </Alert>
          )}
          <LoadingButton type="submit" loading={isPending} className="w-full">
            Register
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default RegisterPage;
