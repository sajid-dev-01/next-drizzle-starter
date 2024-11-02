"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { updateAppearanceSchema } from "../validators";

type FormValues = z.infer<typeof updateAppearanceSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  theme: "light",
};

export default function AppearanceSettings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(updateAppearanceSchema),
    defaultValues,
  });

  function onSubmit(data: FormValues) {
    toast.info(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-muted-foreground text-sm">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <div className="relative w-full">
                  <FormControl>
                    <select
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "block w-full appearance-none bg-transparent font-normal"
                      )}
                      {...field}
                    >
                      <option value="inter">Inter</option>
                      <option value="manrope">Manrope</option>
                      <option value="system">System</option>
                    </select>
                  </FormControl>
                  <ChevronDownIcon className="absolute right-3 top-2.5 size-4 opacity-50" />
                </div>
                <FormDescription>
                  Set the font you want to use in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Theme</FormLabel>
                <FormDescription>
                  Select the theme for the dashboard.
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  <FormItem>
                    <FormLabel>
                      <FormControl>
                        <RadioGroupItem value="light" className="sr-only" />
                      </FormControl>
                      <div
                        className={cn(
                          "cursor-pointer rounded-md border-2 p-1 hover:bg-gray-300",
                          form.getValues("theme") === "light" &&
                            "border-primary"
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-gray-300 p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-20 rounded-lg bg-gray-500" />
                            <div className="h-2 w-24 rounded-lg bg-gray-500" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="size-4 rounded-full bg-gray-500" />
                            <div className="h-2 w-24 rounded-lg bg-gray-500" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="size-4 rounded-full bg-gray-500" />
                            <div className="h-2 w-24 rounded-lg bg-gray-500" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Light
                      </span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel>
                      <FormControl>
                        <RadioGroupItem value="dark" className="sr-only" />
                      </FormControl>
                      <div
                        className={cn(
                          "cursor-pointer rounded-md border-2 p-1 hover:bg-slate-950",
                          form.getValues("theme") === "dark" && "border-primary"
                        )}
                      >
                        <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                          <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-2 w-20 rounded-lg bg-slate-400" />
                            <div className="h-2 w-24 rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="size-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-24 rounded-lg bg-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="size-4 rounded-full bg-slate-400" />
                            <div className="h-2 w-24 rounded-lg bg-slate-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal">
                        Dark
                      </span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />

          <Button type="submit">Update preferences</Button>
        </form>
      </Form>
    </div>
  );
}
