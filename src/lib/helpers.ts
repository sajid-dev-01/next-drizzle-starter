import crypto from "crypto";

import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
import { format } from "date-fns/format";

export const formatDate = (date: Date) => format(date, "dd MMM yy - hh:mm aaa");
export const removeSlashs = (str: string) => str.replace(/(^\/+)|(\/+$)/g, "");

export function generateRandomOTP(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
}

export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
}

export function createRandomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  randomArray.forEach((number) => {
    result += chars[number % chars.length];
  });
  return result;
}

export async function generateRandomString(length: number) {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString("hex").slice(0, length);
}

export function throttle(cb: (...args: any[]) => any, delay = 400) {
  let wait = false;

  return (...args: any[]) => {
    if (wait) return;

    cb(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay);
  };
}

export function debounce(cb: (...args: any[]) => any, delay = 400) {
  let timer: NodeJS.Timeout;
  // Return an anonymous function that takes in any number of arguments
  return function (...args: any[]) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);

    timer = setTimeout(() => {
      cb(...args);
    }, delay);
  };
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
