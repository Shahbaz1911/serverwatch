'use client';

import { AppHeader } from '@/components/app-header';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <AppHeader />
      <AnimatePresence mode="wait">
        <motion.div key={pathname}>
          {children}
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-background z-[9999] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
