'use client';

import { useParams, useRouter } from 'next/navigation';
import { SERVER_APPS, MY_PROJECTS } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowLeft, Server, Power, Globe, ToggleRight } from 'lucide-react';
import { StatusDot } from '@/components/status-dot';
import { useEffect, useState } from 'react';
import type { Status } from '@/components/status-dot';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassIcon } from '@/components/glass-icon';
import { RemoteControl } from '@/components/remote-control';
import { Switch } from '@/components/ui/switch';

const allServices = [...SERVER_APPS, ...MY_PROJECTS];

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const currentIndex = allServices.findIndex(s => s.id === id);
  const service = allServices[currentIndex];

  const [status, setStatus] = useState<Status>('loading');
  const [isServiceActive, setIsServiceActive] = useState(true);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    if (service) {
      fetch(`/api/status?url=${encodeURIComponent(service.url)}`)
        .then(res => res.json())
        .then(data => {
            const currentStatus = data.status || 'offline';
            setStatus(currentStatus);
            setIsServiceActive(currentStatus === 'online');
        })
        .catch(() => {
            setStatus('offline');
            setIsServiceActive(false);
        });
    }
  }, [service]);
  
  useEffect(() => {
    // Start with details visible
    setIsDetailsVisible(true);

    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'Escape') {
        router.push('/dashboard');
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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <div className="container mx-auto p-4 md:p-8 pt-12 md:pt-16 min-h-screen flex flex-col items-center">
       <motion.div
        layoutId={`card-container-${id}`}
        animate={'capsule'}
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
                className="w-full max-w-2xl text-center space-y-8"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{service.name}</h1>
                    <p className="text-muted-foreground mt-2">Detailed information for {service.name}.</p>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <motion.div variants={itemVariants} className="bg-card/50 border rounded-lg p-4 flex items-center gap-4">
                        <Power className="w-6 h-6 text-primary"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <StatusDot status={status} />
                        </div>
                    </motion.div>
                     {service.port && (
                        <motion.div variants={itemVariants} className="bg-card/50 border rounded-lg p-4 flex items-center gap-4">
                            <Server className="w-6 h-6 text-primary"/>
                             <div>
                                <p className="text-sm text-muted-foreground">Port</p>
                                <p className="font-mono text-foreground">{service.port}</p>
                            </div>
                        </motion.div>
                    )}
                    <motion.div variants={itemVariants} className="bg-card/50 border rounded-lg p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <ToggleRight className="w-6 h-6 text-primary"/>
                            <div>
                                <p className="text-sm text-muted-foreground">Service</p>
                                <p className="font-medium text-foreground">
                                    {isServiceActive ? 'Running' : 'Stopped'}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={isServiceActive}
                            onCheckedChange={setIsServiceActive}
                            aria-label="Toggle service status"
                        />
                    </motion.div>
                   
                </div>
                
                <motion.div variants={itemVariants}>
                    <Button onClick={handleOpenLink} size="lg" className="mt-4">
                        Open Service <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>

            </motion.div>
        )}
       </AnimatePresence>

       <RemoteControl
          variant={'capsule'}
          onOk={() => {
            router.push('/dashboard');
          }}
          onNext={handleNext}
          onPrev={handlePrev}
       />
    </div>
  );
}
