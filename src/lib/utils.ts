import { ClassValue, clsx } from "clsx";
import { format } from "date-fns/format";
import { SafeActionResult } from "next-safe-action";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { env } from "@/env";

import { ValidationError } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleActionError(
  err: SafeActionResult<any, any, any>,
  form: UseFormReturn<any>
) {
  if (err.validationErrors) {
    if (err.validationErrors.fieldErrors) {
      Object.keys(err.validationErrors.fieldErrors || {}).forEach((key) => {
        form.setError(key as any, {
          message: (err.validationErrors.fieldErrors as any)[key][0],
        });
      });
    }
  }

  if (err.serverError) {
    if (err.serverError.name === "ValidationError") {
      const e = err.serverError as ValidationError;

      if (e.fieldErrors) {
        Object.keys(e.fieldErrors || {}).forEach((key) => {
          form.setError(key as any, {
            message: (e.fieldErrors as any)[key][0],
          });
        });
      }
    } else {
      toast.error(err.serverError.message);
    }
  }
}

export const formatDate = (date: Date) => format(date, "dd MMM yy - hh:mm aaa");

let throttlePause = false;
export function throttle(cb: () => void, time: number) {
  if (throttlePause) return;

  throttlePause = true;

  setTimeout(() => {
    cb();
    throttlePause = false;
  }, time);
}

let debounceTimer: NodeJS.Timeout;
export function debounce(cb: () => void, time = 300) {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(cb, time);
}

export function wait(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}
