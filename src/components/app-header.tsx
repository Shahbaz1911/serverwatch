"use client";
import React, { useState, useEffect } from 'react';
import { Server, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth, useUser } from "@/firebase";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { SERVER_APPS, MY_PROJECTS } from '@/lib/config';
import BubbleMenu from './ui/bubble-menu';

const allServices = [...SERVER_APPS, ...MY_PROJECTS];

export function AppHeader() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      try {
        await auth.signOut();
        toast({
            variant: "destructive",
            title: "Logout Successful",
            description: "You have been logged out.",
        });
        router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "An error occurred during logout. Please try again.",
        });
      }
    }
  };

  const navItems = allServices.map((app, index) => ({
    label: app.name,
    href: app.url,
    ariaLabel: `Open ${app.name}`,
    rotation: (index % 2 === 0 ? 1 : -1) * (Math.random() * 4 + 4), // random rotation between 4-8 deg
    hoverStyles: { bgColor: app.color, textColor: 'hsl(var(--primary-foreground))' },
  }));


  const renderProfileAction = () => {
    if (!mounted || isUserLoading) {
      return null;
    }
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>
                <UserIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return null;
  };


  return (
      <BubbleMenu
        items={navItems}
        logo={
            <div className="flex items-center gap-2 text-foreground">
                <Server className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl font-bold">ServerWatch</span>
            </div>
        }
        profileAction={renderProfileAction()}
    />
  );
};
