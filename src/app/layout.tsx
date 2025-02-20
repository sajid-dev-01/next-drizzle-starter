import type { Metadata } from "next";
import { Libre_Franklin, Roboto } from "next/font/google";
import { cookies } from "next/headers";

import { Providers } from "@/components/providers";
import { AuthContext } from "@/context/auth-context";
import { env } from "@/env";
import { authenticate } from "@/features/auth/lib/auth";
import { FONT_COOKIE_NAME } from "@/hooks/use-font";
import { constructMetadata } from "@/lib/construct-metadata";
import { cn } from "@/lib/utils";

import "@uploadthing/react/styles.css";
import "./globals.css";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-libre_franklin",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = constructMetadata({
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s - ${env.NEXT_PUBLIC_APP_NAME}`,
  },
});

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const [auth, cookieList] = await Promise.all([authenticate(), cookies()]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col antialiased",
          libre_franklin.variable,
          roboto.variable,
          cookieList.get(FONT_COOKIE_NAME)?.value ?? "font-roboto"
        )}
        suppressHydrationWarning
      >
        <AuthContext session={auth?.session} user={auth?.user}>
          <Providers>{children}</Providers>
        </AuthContext>
      </body>
    </html>
  );
}
