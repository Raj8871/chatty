"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function AppHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Passkey Chat</h1>
        </Link>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <ProfileDropdown />
          ) : null}
        </div>
      </div>
    </header>
  );
}
