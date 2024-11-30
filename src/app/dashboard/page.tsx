import { redirect } from "next/navigation";

import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";

export default async function DashboardPage() {
  const auth = await authenticate();

  if (!auth?.session) return redirect(AUTH_URI.signIn);

  return <div>Dashboard Page</div>;
}
