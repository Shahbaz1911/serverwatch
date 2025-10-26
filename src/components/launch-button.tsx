'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LaunchButtonProps {
  onLaunch: () => void;
  className?: string;
}

export const LaunchButton: React.FC<LaunchButtonProps> = ({ onLaunch, className }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const tlClick = gsap.timeline({ paused: true });
    tlClick
      .to(button, { scale: 0.95, duration: 0.1, ease: 'power2.out' })
      .to(button, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      if (!tlClick.isActive()) {
        tlClick.restart();
      }
      // Delay launch to allow animation to be seen
      setTimeout(onLaunch, 200);
    };

    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, [onLaunch]);

  return (
    <div className={cn("relative w-full max-w-xs mx-auto", className)}>
        <Button
            ref={buttonRef}
            size="lg"
            className="w-full font-bold text-lg py-6"
        >
            Launch
        </Button>
    </div>
  );
};
