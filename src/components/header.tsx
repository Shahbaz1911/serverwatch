"use client";

import { Server, LogIn, LogOut } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { Button } from "./ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-4">
          <Server className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-foreground">
            ServerWatch
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {isUserLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : user ? (
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link href="/">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}