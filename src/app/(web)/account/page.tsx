import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AUTH_URI, CONFIRM_PASSWORD_PAGE } from "@/constants";
import { validateCurrentRequest } from "@/lib/auth";

import SettingTabs from "./_components/SettingTabs";

const AccountPage: React.FC = async () => {
  const [headerList, auth] = await Promise.all([
    headers(),
    validateCurrentRequest(),
  ]);

  if (!auth) return redirect(AUTH_URI.signIn);

  if (
    !auth.session.passwordConfirmedAt ||
    auth.session.passwordConfirmedAt.getTime() + 1000 * 60 * 60 < Date.now()
  ) {
    return redirect(
      `${CONFIRM_PASSWORD_PAGE}?callback-url=${headerList.get("x-current-path")}`
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-tight">Account</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <SettingTabs />
        </CardContent>
      </Card>
    </main>
  );
};

export default AccountPage;
