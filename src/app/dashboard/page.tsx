"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ServerCard } from "@/components/server-card";
import type { Status } from "@/components/status-dot";
import { SERVER_APPS, MY_PROJECTS } from "@/lib/config";
import { useUser } from "@/firebase";
import { Separator } from "@/components/ui/separator";
import { Hero } from "@/components/hero";
import { RemoteControl } from "@/components/remote-control";
import { SystemOverview } from "@/components/system-overview";

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

  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, allServices.length);
  }, []);

  useEffect(() => {
    if (cardRefs.current[selectedIndex]) {
      cardRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedIndex]);

  const checkAllStatuses = useCallback(async () => {
    const promises = allServices.map(async (srv) => {
      try {
        const res = await fetch(`/api/status?url=${encodeURIComponent(srv.url)}`);
        if (!res.ok) {
          console.error(`Status check failed for ${srv.name}: ${res.status}`);
          return { id: srv.id, status: 'offline' as Status };
        }
        const data = await res.json();
        return { id: srv.id, status: data.status as Status };
      } catch (error) {
        console.error(`Error checking status for ${srv.name}:`, error);
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
    if(initialLoad) setInitialLoad(false);
  }, [initialLoad]);

  const handleSelectNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % allServices.length);
  }, []);

  const handleSelectPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + allServices.length) % allServices.length);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedIndex >= 0 && selectedIndex < allServices.length) {
      window.open(allServices[selectedIndex].url, '_blank', 'noopener,noreferrer');
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowRight':
          handleSelectNext();
          break;
        case 'ArrowLeft':
          handleSelectPrev();
          break;
        case 'Enter':
          handleConfirm();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectNext, handleSelectPrev, handleConfirm]);

  useEffect(() => {
    if(user) {
      checkAllStatuses();
      const interval = setInterval(checkAllStatuses, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [checkAllStatuses, user]);

  if (isUserLoading || !user || initialLoad) {
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

        <Separator className="my-8" />
        
        <section id="system-overview" className="mb-12">
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
                ref={el => cardRefs.current[index] = el}
                name={app.name}
                url={app.url}
                icon={app.icon}
                status={statuses[app.id] || 'loading'}
                animationDelay={index * 0.05}
                color={app.color}
                port={app.port}
                uptime={app.uptime}
                isSelected={selectedIndex === index}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-headline text-3xl font-bold">My Projects</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MY_PROJECTS.map((project, index) => {
              const overallIndex = SERVER_APPS.length + index;
              return (
                <ServerCard
                  key={project.id}
                  ref={el => cardRefs.current[overallIndex] = el}
                  name={project.name}
                  url={project.url}
                  icon={project.icon}
                  status={statuses[project.id] || 'loading'}
                  animationDelay={overallIndex * 0.05}
                  color={project.color}
                  port={project.port}
                  uptime={project.uptime}
                  isSelected={selectedIndex === overallIndex}
                />
              );
            })}
          </div>
        </section>
      </main>
      <RemoteControl 
        onNext={handleSelectNext}
        onPrev={handleSelectPrev}
        onOk={handleConfirm}
      />
    </div>
  );
}
