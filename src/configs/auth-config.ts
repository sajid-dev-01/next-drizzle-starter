import "server-only";

import { env } from "@/env";
import { absoluteUrl } from "@/lib/utils";

export default {
  enableSignup: true,
  email: {
    enable: true,
    enableConfirmation: true,
    confirmationExpires: env.EMAIL_CONFIRMATION_EXPIRES * 1000,
  },
  magicLink: {
    enabel: false,
  },
  google: {
    enable: true,
    clientId: env.GOOGLE_CLIENT_ID,
    secret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: absoluteUrl("/sign-in/google/callback"),
  },
  github: {
    enable: true,
    clientId: "", //env.GITHUB_CLIENT_ID,
    secret: "", // env.GITHUB_CLIENT_SECRET,
    redirectUri: absoluteUrl("/sign-in/github/callback"),
  },
};
