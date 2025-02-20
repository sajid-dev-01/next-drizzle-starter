"use client";

import { useEffect, useState } from "react";

export const FONT_COOKIE_NAME = "font";
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function useFont() {
  const [font, setFont] = useState("");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const fontCookie = cookies
      .find((c) => c.startsWith(FONT_COOKIE_NAME))
      ?.split("=")[1];

    setFont(fontCookie as any);
  }, []);

  useEffect(() => {
    if (!font) return;

    const classList = document.body.classList;

    document.cookie = `${FONT_COOKIE_NAME}=${font}; path=/; max-age=${FONT_COOKIE_MAX_AGE}`;

    if (classList.contains(font)) return;

    classList.forEach((c) => {
      if (c.startsWith("font-")) {
        classList.remove(c);
      }
    });

    classList.add(font);
  }, [font]);

  return { font, setFont };
}
