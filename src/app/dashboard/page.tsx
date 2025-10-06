"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ServerCard } from "@/components/server-card";
import type { Status } from "@/components/status-dot";
import { SERVER_APPS, MY_PROJECTS } from "@/lib/config";
import { useUser } from "@/firebase";
import { RemoteControl } from "@/components/remote-control";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

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
  
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);


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


  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const handleSelectNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleSelectPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleConfirm = useCallback(() => {
    if (current >= 0 && current < allServices.length) {
      window.open(allServices[current].url, '_blank', 'noopener,noreferrer');
    }
  }, [current]);
  
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
      <main className="container mx-auto p-4 md:p-8 pt-24 md:pt-32 space-y-12">
        
        <section>
          <h2 className="font-headline text-3xl font-bold mb-4">Server Apps</h2>
          <Carousel setApi={setApi} opts={{ align: "start", containScroll: "trimSnaps" }} className="w-full">
            <CarouselContent>
              {SERVER_APPS.map((app, index) => (
                <CarouselItem key={app.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1 h-full">
                    <ServerCard
                      name={app.name}
                      url={app.url}
                      icon={app.icon}
                      status={statuses[app.id] || 'loading'}
                      animationDelay={index * 0.05}
                      color={app.color}
                      isSelected={current === index}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section>
          <h2 className="font-headline text-3xl font-bold mb-4">My Projects</h2>
          <Carousel opts={{ align: "start", containScroll: "trimSnaps" }} className="w-full">
            <CarouselContent>
              {MY_PROJECTS.map((app, index) => (
                <CarouselItem key={app.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1 h-full">
                    <ServerCard
                      name={app.name}
                      url={app.url}
                      icon={app.icon}
                      status={statuses[app.id] || 'loading'}
                      animationDelay={(SERVER_APPS.length + index) * 0.05}
                      color={app.color}
                      isSelected={current === SERVER_APPS.length + index}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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