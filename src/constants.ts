export const DEFAULT_LOGIN_REDIRECT = "/";

export const AUTH_URI = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  newPassword: "/new-password",
  confirmEmail: "/confirm-email",
} as const;

export const CONFIRM_PASSWORD_PAGE = "/confirm-password";

export const DEFAULT_QUERY_PARAMS = {
  per_page: 10,
  page: 1,
  sort: "desc",
} as const;
