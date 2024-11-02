"use client";

import { CircleUserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { signOutAction } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_URI } from "@/constants";
import { useAuth } from "@/context/AuthContext";

type Props = {};

const UserMenu: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { user } = useAuth();

  const { execute } = useAction(signOutAction, {
    onSuccess() {
      router.replace(AUTH_URI.signIn);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>
              <CircleUserIcon className="size-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user && (
          <>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => execute()}
          >
            Sign out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href={AUTH_URI.signIn}>Sign in</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
