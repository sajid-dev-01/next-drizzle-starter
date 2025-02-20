"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

interface Props {
  workspaces: { id: string; name: string; image?: string }[];
  projects: { id: string; name: string }[];
}

export function AppSidebar({
  workspaces,
  projects,
  ...props
}: React.ComponentProps<typeof Sidebar> & Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="inline-flex items-end gap-2 py-2">
          <div className="hidden group-data-[collapsible=icon]:block">
            <Image src="/assets/icon.svg" alt="icon" height={30} width={30} />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <Image src="/assets/logo.svg" alt="icon" height={30} width={150} />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
