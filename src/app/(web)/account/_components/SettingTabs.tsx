"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";

const tabs = {
  Profile: "Profile",
  Security: "Security",
  Appearance: "Appearance",
  Notifications: "Notifications",
} as const;

export default function SettingTabs() {
  return (
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
  );
}
