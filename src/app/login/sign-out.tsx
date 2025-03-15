"use client";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        await signOut({ redirect: true, redirectTo: "/login" });
      }}
    >
      Sign Out
    </Button>
  );
}
