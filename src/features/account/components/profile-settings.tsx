"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { AvatarUploader } from "@/components/upload/avatar-uploader";
import { useUploadThing } from "@/components/upload/upload-thing";
import { useAuth } from "@/context/auth-context";
import { handleActionError } from "@/lib/handle-action-error";

import { updateProfileSchema } from "../schemas";
import {
  deleteProfileImageAction,
  updateProfileAction,
} from "../server/actions";

type FormValues = z.infer<typeof updateProfileSchema>;

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name,
      image: user?.image ?? "",
    },
  });

  const { execute: deleteImage, isPending: isDeleting } = useAction(
    deleteProfileImageAction,
    {
      onSuccess: () => {
        toast.success("profile image deleted!");
      },
    }
  );

  const { execute, isPending } = useAction(updateProfileAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      toast.success("profile updated!");
    },
  });

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      form.setValue("image", res[0].url);
      toast.success("Uploaded successfully");
    },
    onUploadError: () => {
      toast.error("Error on uploading");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This is how others will see you on the site.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => execute(v))}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <Label className="mb-4 block">Profile Photo</Label>
              <div className="flex flex-col">
                {user?.image ? (
                  <div className="flex flex-col items-start gap-2">
                    <Image
                      src={user.image}
                      alt="profile image"
                      height={100}
                      width={100}
                    />
                    <ButtonLoading
                      loading={isDeleting}
                      size={"sm"}
                      variant={"destructive"}
                      onClick={() => deleteImage()}
                    >
                      Remove
                    </ButtonLoading>
                  </div>
                ) : (
                  <AvatarUploader onUpload={(file) => startUpload([file])} />
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Type country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Type state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Type city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip code</FormLabel>
                  <FormControl>
                    <Input placeholder="Type zipcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Type full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <ButtonLoading type="submit" loading={isPending}>
                Update
              </ButtonLoading>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
