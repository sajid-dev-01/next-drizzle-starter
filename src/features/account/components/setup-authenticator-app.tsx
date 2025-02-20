"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Check, Copy, EyeIcon } from "lucide-react";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { useAuth } from "@/context/auth-context";
import { handleActionError } from "@/lib/handle-action-error";

import { VerifyOTPPayload, verifyOTPSchema } from "../schemas";
import { disableAuthenticatorAction, verifyTotpCode } from "../server/actions";

const SetupAuthenticator = () => {
  const { user } = useAuth();
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery<{
    message: string;
    key: string;
    qrImageUrl: string;
  }>({
    queryKey: ["/mfa/authenticator/setup"],
    enabled: isOpen,
    staleTime: Infinity,
  });

  const form = useForm<VerifyOTPPayload>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: { code: "" },
  });

  const { execute: verifyToken, isPending: isSubmitting } = useAction(
    verifyTotpCode,
    {
      onError: ({ error }) => handleActionError(error, form),
      onSuccess: ({ data }) => {
        toast.success(data?.message ?? "Setup completed");
        setIsOpen(false);
      },
    }
  );

  const { execute: disable, isPending: isDisabling } = useAction(
    disableAuthenticatorAction,
    {
      onError: ({ error }) =>
        error.serverError?.message && toast.error(error.serverError.message),
      onSuccess: ({ data }) => {
        toast.success(data?.message ?? "Authenticator disabled!");
      },
    }
  );

  const onCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, []);

  if (user?.isTwoFAEnabled) {
    return (
      <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" disabled={isDisabling} variant="destructive">
            Disable
          </Button>
        </DialogTrigger>
        <DialogContent className="text-sm">
          <DialogHeader>
            <DialogTitle>Disable Authenticator App</DialogTitle>
            <DialogDescription>
              Enter your OTP code to disable app
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => disable(v))}
              className="flex w-full flex-col gap-4 "
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP code</FormLabel>
                    <FormControl>
                      <div>
                        <InputOTP
                          {...field}
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          containerClassName="inline-flex"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant={"outline"}>Cancle</Button>
                </DialogClose>
                <ButtonLoading type="submit" loading={isSubmitting}>
                  Submit
                </ButtonLoading>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={isLoading}>
          Enable
        </Button>
      </DialogTrigger>
      <DialogContent className="text-sm">
        <DialogHeader>
          <DialogTitle>Setup Authenticator App</DialogTitle>
          <DialogDescription>
            Each time you sign in, in addition to your password, you'll use an
            authenticator app to generate a one-time code.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <div className="font-semibold">
            <Badge>Step 1</Badge> Scan the QR code
          </div>
          <p className="text-muted-foreground mt-1">
            Use an app like '1Password' or 'Google Authenticator' to scan the QR
            code below.
          </p>
        </div>
        <div className="bg-muted dark:bg-muted/20 flex items-center gap-4 rounded-md p-4">
          <div className="rounded-md bg-white">
            {isLoading || !data?.qrImageUrl ? (
              <Skeleton className="size-[160px]" />
            ) : (
              <Image
                alt="QR code"
                decoding="async"
                src={data.qrImageUrl}
                width="160"
                height="160"
                className="rounded-md"
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-semibold">Can't scan QR code?</p>
            {showKey && data?.key ? (
              <>
                <Input readOnly value={data.key} className="text-sm" />
                <Button
                  size={"sm"}
                  variant={"outline"}
                  disabled={copied}
                  onClick={() => onCopy(data?.key)}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  Copy setup key
                </Button>
              </>
            ) : (
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => setShowKey(true)}
              >
                <EyeIcon /> View setup Key
              </Button>
            )}
          </div>
        </div>
        <div className="mt-6">
          <div className="font-semibold">
            <Badge>Step 2</Badge> Enter Verification Code
          </div>
          <p className="text-muted-foreground mt-1">
            Enter the 6-digit code you see in your authenticator app
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => verifyToken(v))}
            className="flex w-full flex-col gap-4 "
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP code</FormLabel>
                  <FormControl>
                    <div>
                      <InputOTP
                        {...field}
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        containerClassName="inline-flex"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancle</Button>
              </DialogClose>
              <ButtonLoading type="submit" loading={isSubmitting}>
                Verify
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SetupAuthenticator;
