"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ServerCard } from "@/components/server-card";
import type { Status } from "@/components/status-dot";
import { SERVER_APPS, MY_PROJECTS } from "@/lib/config";
import { useUser } from "@/firebase";
import { RemoteControl } from "@/components/remote-control";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";

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
    const serviceId = allServices[current]?.id;
    if (serviceId) {
      router.push(`/dashboard/app/${serviceId}`);
    }
  }, [current, router]);
  
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
        <span className="font-press-start text-2xl font-bold animate-pulse">ServerWatch</span>
      </div>
    );
  }
  
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };


  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center pb-32">
        <main className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
            <div className="text-center h-16 flex items-center mb-12">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={current}
                        className="font-headline text-3xl md:text-4xl font-bold"
                        variants={titleVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {allServices[current]?.name}
                    </motion.h1>
                </AnimatePresence>
            </div>

            <LayoutGroup>
            <section className="w-full">
                <Carousel setApi={setApi} opts={{ align: "center", loop: true }} className="w-full">
                <CarouselContent>
                    {allServices.map((app, index) => (
                    <CarouselItem key={app.id} className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                        <div className="p-1 h-full" data-id={app.id}>
                        <ServerCard
                            id={app.id}
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
            </LayoutGroup>
        </main>
      </div>
      <RemoteControl
        variant="circle" 
        onNext={handleSelectNext}
        onPrev={handleSelectPrev}
        onOk={handleConfirm}
      />
    </div>
  );
}
