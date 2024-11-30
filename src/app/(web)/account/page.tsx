import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui-extension/heading";
import { CONFIRM_PASSWORD_PAGE } from "@/constants";
import AppearanceSettings from "@/features/account/components/appearance-settings";
import NotificationSettings from "@/features/account/components/notification-settings";
import ProfileSettings from "@/features/account/components/profile-settings";
import SecuritySettings from "@/features/account/components/security-settings";
import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";

const tabs = {
  Profile: "Profile",
  Security: "Security",
  Appearance: "Appearance",
  Notifications: "Notifications",
} as const;

export default async function AccountPage() {
  const [headerList, auth] = await Promise.all([headers(), authenticate()]);

  if (!auth) return redirect(AUTH_URI.signIn);

  if (
    auth.user.password &&
    (!auth.session.passwordConfirmedAt ||
      auth.session.passwordConfirmedAt.getTime() + 1000 * 60 * 60 < Date.now())
  ) {
    return redirect(
      `${CONFIRM_PASSWORD_PAGE}?callback-url=${headerList.get("x-current-path")}`
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="container">
        <Card>
          <CardHeader>
            <Heading>Account</Heading>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            <Tabs
              defaultValue="Profile"
              className="grid gap-6 lg:grid-cols-[250px,1fr]"
            >
              <TabsList className="scrollbar flex h-auto justify-start gap-2 bg-transparent lg:flex-col">
                {Object.values(tabs).map((item) => (
                  <TabsTrigger
                    key={item}
                    value={item}
                    className="bg-muted hover:text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start py-2 lg:w-full"
                  >
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={tabs.Profile}>
                <ProfileSettings />
              </TabsContent>
              <TabsContent value={tabs.Security}>
                <SecuritySettings />
              </TabsContent>
              <TabsContent value={tabs.Appearance}>
                <AppearanceSettings />
              </TabsContent>
              <TabsContent value={tabs.Notifications}>
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
