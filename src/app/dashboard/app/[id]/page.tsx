'use client';

import { useParams, useRouter } from 'next/navigation';
import { SERVER_APPS, MY_PROJECTS } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { StatusDot } from '@/components/status-dot';
import { useEffect, useState } from 'react';
import type { Status } from '@/components/status-dot';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassIcon } from '@/components/glass-icon';
import { RemoteControl } from '@/components/remote-control';

const allServices = [...SERVER_APPS, ...MY_PROJECTS];

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const currentIndex = allServices.findIndex(s => s.id === id);
  const service = allServices[currentIndex];

  const [status, setStatus] = useState<Status>('loading');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    if (service) {
      fetch(`/api/status?url=${encodeURIComponent(service.url)}`)
        .then(res => res.json())
        .then(data => setStatus(data.status || 'offline'))
        .catch(() => setStatus('offline'));
    }
  }, [service]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsDetailsVisible(true);
      }
       if (e.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);


  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Service not found.</p>
      </div>
    );
  }
  
  const Icon = service.icon;

  const handleOpenLink = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };
  
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % allServices.length;
    router.push(`/dashboard/app/${allServices[nextIndex].id}`);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + allServices.length) % allServices.length;
    router.push(`/dashboard/app/${allServices[prevIndex].id}`);
  };


  const variants = {
    initial: { scale: 1.5, y: '30vh',
    boxShadow: '0 0 0px hsl(var(--primary))' },
    capsule: { 
      scale: 1, 
      y: 0,
      boxShadow: '0 0 20px hsl(var(--primary))',
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 30,
        delay: 0.2
      }
    },
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.5, 
        staggerChildren: 0.1,
        when: 'beforeChildren',
      }
    },
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-12 md:pt-16 min-h-screen flex flex-col items-center">
       <motion.div
        layoutId={`card-container-${id}`}
        animate={isDetailsVisible ? 'capsule' : 'initial'}
        variants={variants}
        className="rounded-full p-4 mb-8 bg-card border border-border"
       >
         <GlassIcon
            icon={<Icon className="w-full h-full" />}
            color={service.color || 'blue'}
            label={service.name}
            customClass='w-16 h-16'
            isSelected={true}
        />
       </motion.div>

       <AnimatePresence>
        {isDetailsVisible && (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={detailsVariants}
                className="w-full max-w-2xl"
            >
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-3 font-headline text-3xl">
                        {service.name}
                    </CardTitle>
                    <CardDescription className="text-center">Detailed information for {service.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <motion.div variants={detailsVariants} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-muted-foreground">Status</span>
                        <StatusDot status={status} />
                    </motion.div>
                    {service.port && (
                        <motion.div variants={detailsVariants} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-muted-foreground">Port</span>
                        <span className="font-mono text-foreground">{service.port}</span>
                        </motion.div>
                    )}
                    {service.uptime && (
                        <motion.div variants={detailsVariants} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-mono text-foreground">{service.uptime}</span>
                        </motion.div>
                    )}
                    <motion.div variants={detailsVariants} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-muted-foreground">URL</span>
                        <a href={service.url} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline truncate max-w-[200px] sm:max-w-full">
                            {service.url}
                        </a>
                        </motion.div>
                     <motion.div variants={detailsVariants} className='flex items-center justify-center gap-4'>
                        <Button onClick={() => router.back()} className="mt-4" variant='outline'>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button onClick={handleOpenLink} className="mt-4">
                            Open Service <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                     </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
       </AnimatePresence>

       <RemoteControl
          variant={isDetailsVisible ? 'capsule' : 'circle'}
          onOk={() => {
            if (isDetailsVisible) {
                router.back();
            } else {
                setIsDetailsVisible(true);
            }
          }}
          onNext={isDetailsVisible ? handleNext : () => {}}
          onPrev={isDetailsVisible ? handlePrev : () => {}}
       />
    </div>
  );
}
