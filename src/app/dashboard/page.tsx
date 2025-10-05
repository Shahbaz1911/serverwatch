"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ServerCard } from "@/components/server-card";
import type { Status } from "@/components/status-dot";
import { SERVER_APPS, MY_PROJECTS } from "@/lib/config";
import { useUser } from "@/firebase";
import { SystemOverview } from "@/components/system-overview";
import { Separator } from "@/components/ui/separator";
import { Hero } from "@/components/hero";

const allServices = [...SERVER_APPS, ...MY_PROJECTS];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => {
    const initialStatuses: Record<string, Status> = {};
    allServices.forEach(srv => {
      initialStatuses[srv.id] = 'loading';
    });
    return initialStatuses;
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const checkAllStatuses = useCallback(async () => {
    const promises = allServices.map(async (srv) => {
      try {
        const res = await fetch(`/api/status?url=${encodeURIComponent(srv.url)}`);
        if (!res.ok) {
          return { id: srv.id, status: 'offline' as Status };
        }
        const data = await res.json();
        return { id: srv.id, status: data.status as Status };
      } catch (error) {
        return { id: srv.id, status: 'offline' as Status };
      }
    });

    const results = await Promise.all(promises);
    setStatuses(prev => {
        const newStatuses = {...prev};
        results.forEach(res => {
            newStatuses[res.id] = res.status;
        });
        return newStatuses;
    });
  }, []);

  useEffect(() => {
    if(user) {
      checkAllStatuses();
      const interval = setInterval(checkAllStatuses, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [checkAllStatuses, user]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8 pt-24 md:pt-32">
        
        <Hero />

        <section className="my-8">
            <h2 className="mb-6 font-headline text-3xl font-bold">System Overview</h2>
            <SystemOverview />
        </section>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="mb-6 font-headline text-3xl font-bold">Server Apps</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVER_APPS.map((app, index) => (
              <ServerCard
                key={app.id}
                name={app.name}
                url={app.url}
                icon={app.icon}
                status={statuses[app.id] || 'loading'}
                animationDelay={index * 0.05}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-headline text-3xl font-bold">My Projects</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MY_PROJECTS.map((project, index) => (
              <ServerCard
                key={project.id}
                name={project.name}
                url={project.url}
                icon={project.icon}
                status={statuses[project.id] || 'loading'}
                animationDelay={(SERVER_APPS.length + index) * 0.05}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
