"use client";
import React from 'react';
import { CardNav } from '@/components/ui/card-nav';
import { Server, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth, useUser } from "@/firebase";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { SERVER_APPS, MY_PROJECTS } from '@/lib/config';

export function AppHeader() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      toast({
        variant: "destructive",
        title: "Logout Successful",
        description: "You have been logged out.",
      });
      router.push("/");
    }
  };

  const navItems = [
    {
      label: "Server Applications",
      bgColor: "hsl(var(--background))",
      textColor: "hsl(var(--foreground))",
      links: SERVER_APPS.map(app => ({
        label: app.name,
        href: app.url,
        ariaLabel: `Open ${app.name}`
      }))
    },
    {
      label: "Projects", 
      bgColor: "hsl(var(--background))",
      textColor: "hsl(var(--foreground))",
      links: MY_PROJECTS.map(project => ({
        label: project.name,
        href: project.url,
        ariaLabel: `Open ${project.name}`
      }))
    },
  ];

  return (
      <CardNav
        items={navItems}
        baseColor="hsl(var(--card))"
        menuColor="hsl(var(--foreground))"
        buttonBgColor="hsl(var(--primary))"
        buttonTextColor="hsl(var(--primary-foreground))"
        logo={
            <div className="flex items-center gap-2">
                <Server className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl font-bold">ServerWatch</span>
            </div>
        }
        logoAlt="ServerWatch Logo"
        profileAction={
            !isUserLoading && user && (
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
            )
        }
    />
  );
};
