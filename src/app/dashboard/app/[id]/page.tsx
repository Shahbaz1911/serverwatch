'use client';

import { useParams, useRouter } from 'next/navigation';
import { SERVER_APPS, MY_PROJECTS } from '@/lib/config';
import { ArrowLeft, Server, Power } from 'lucide-react';
import { StatusDot } from '@/components/status-dot';
import { useEffect, useState } from 'react';
import type { Status } from '@/components/status-dot';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassIcon } from '@/components/glass-icon';
import { RemoteControl } from '@/components/remote-control';
import StarBorder from '@/components/StarBorder';

const allServices = [...SERVER_APPS, ...MY_PROJECTS];

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const currentIndex = allServices.findIndex(s => s.id === id);
  const service = allServices[currentIndex];

  const [status, setStatus] = useState<Status>('loading');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  useEffect(() => {
    if (service) {
      fetch(`/api/status?url=${encodeURIComponent(service.url)}`)
        .then(res => res.json())
        .then(data => {
            const currentStatus = data.status || 'offline';
            setStatus(currentStatus);
        })
        .catch(() => {
            setStatus('offline');
        });
    }
  }, [service]);
  
  useEffect(() => {
    // Start with details visible
    setIsDetailsVisible(true);

    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'Escape') {
        setIsNavigatingBack(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGoBack = () => {
    setIsNavigatingBack(true);
  };
  
  const handleLaunch = () => {
    if (service) {
      window.open(service.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Service not found.</p>
      </div>
    );
  }
  
  const Icon = service.icon;

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
    exit: {
      scale: 1.5,
      y: '30vh',
      transition: { ease: 'easeIn', duration: 0.3 }
    }
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
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <div className="container mx-auto p-4 md:p-8 pt-12 md:pt-16 min-h-screen flex flex-col items-center pb-32">
       <div className="flex flex-col items-center gap-4">
        <AnimatePresence>
        {!isNavigatingBack && (
            <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="font-headline text-4xl md:text-5xl font-bold">{service.name}
          </motion.h1>
        )}
        </AnimatePresence>
        <motion.div
            layoutId={`card-container-${id}`}
            initial="initial"
            animate={isNavigatingBack ? 'exit' : 'capsule'}
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
       </div>

       <AnimatePresence>
        {isDetailsVisible && !isNavigatingBack && (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={detailsVariants}
                className="w-full max-w-2xl text-center space-y-8"
            >
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
                </div>
                
                <motion.div variants={itemVariants} className="mt-8">
                    <StarBorder
                        as="button"
                        color="hsl(var(--primary))"
                        speed="3s"
                        onClick={handleLaunch}
                    >
                        Launch
                    </StarBorder>
                </motion.div>

            </motion.div>
        )}
       </AnimatePresence>

       <RemoteControl
          variant={isNavigatingBack ? 'circle' : 'capsule'}
          onOk={handleGoBack}
          onNext={() => router.push('/dashboard')}
          onPrev={() => router.push('/dashboard')}
          onAnimationComplete={() => {
            if (isNavigatingBack) {
              router.push('/dashboard');
            }
          }}
       />
    </div>
  );
}
