"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { InputPhone } from "@/components/ui-extension/input-phone";
import { useAuth } from "@/context/auth-context";

import {
  PhonePayload,
  phoneSchema,
  VerifyOTPPayload,
  verifyOTPSchema,
} from "../schemas";

const SetupSMSVerification = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPhoneAdd, setIsPhoneAdd] = useState(false);

  const otpForm = useForm<VerifyOTPPayload>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: { code: "" },
  });

  const phoneForm = useForm<PhonePayload>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  if (user?.isTwoFAEnabled) {
    return (
      <ButtonLoading size={"sm"} loading={false} variant={"destructive"}>
        Disable
      </ButtonLoading>
    );
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Enable</Button>
      </DialogTrigger>
      <DialogContent className="text-sm">
        <DialogHeader>
          <DialogTitle>Setup SMS Verification</DialogTitle>
          <DialogDescription>
            Each time you sign in, in addition to your password, you'll use a
            one-time code sent to your phone no.
          </DialogDescription>
        </DialogHeader>
        {!isPhoneAdd && (
          <Form {...phoneForm}>
            <form
              onSubmit={phoneForm.handleSubmit(() => {
                setIsPhoneAdd(true);
              })}
              className="flex w-full flex-col gap-4 "
            >
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your phone no</FormLabel>
                    <FormControl>
                      <InputPhone
                        {...field}
                        onChange={(v) => phoneForm.setValue("phone", v ?? "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant={"outline"}>Cancle</Button>
                </DialogClose>
                <ButtonLoading
                  type="submit"
                  loading={phoneForm.formState.isSubmitting}
                >
                  Send
                </ButtonLoading>
              </DialogFooter>
            </form>
          </Form>
        )}
        {isPhoneAdd && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit((v) => toast.info(v.code))}
              className="flex w-full flex-col gap-4 "
            >
              <FormField
                control={otpForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the code</FormLabel>
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
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
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
                <ButtonLoading
                  type="submit"
                  loading={otpForm.formState.isSubmitting}
                >
                  Verify
                </ButtonLoading>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetupSMSVerification;
