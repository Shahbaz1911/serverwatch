"use client";
import React from 'react';
import { CardNav } from '@/components/ui/card-nav';
import { Server, LogOut, Briefcase, Info, Mail } from 'lucide-react';
import { useAuth, useUser } from "@/firebase";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function AppHeader() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push("/");
    }
  };

  const navItems = [
    {
      label: "About",
      bgColor: "hsl(var(--background))",
      textColor: "hsl(var(--foreground))",
      links: [
        { label: "Company", href: "#", ariaLabel: "About Company" },
        { label: "Careers", href: "#", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "hsl(var(--background))",
      textColor: "hsl(var(--foreground))",
      links: [
        { label: "Featured", href: "#", ariaLabel: "Featured Projects" },
        { label: "Case Studies", href: "#", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "hsl(var(--background))", 
      textColor: "hsl(var(--foreground))",
      links: [
        { label: "Email", href: "#", ariaLabel: "Email us" },
        { label: "Twitter", href: "#", ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "#", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
      <CardNav
        items={navItems}
        baseColor="hsl(var(--card))"
        menuColor="hsl(var(--foreground))"
        buttonBgColor="hsl(var(--primary))"
        buttonTextColor="hsl(var(--primary-foreground))"
        logo={<Server className="h-7 w-7 text-primary" />}
        logoAlt="ServerWatch Logo"
        cta={
          isUserLoading ? null : user ? (
            <Button variant="ghost" onClick={handleLogout} className="h-full rounded-lg">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : null
        }
    />
  );
};
