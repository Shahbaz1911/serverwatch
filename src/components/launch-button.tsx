'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

interface LaunchButtonProps {
  onLaunch: () => void;
}

export function LaunchButton({ onLaunch }: LaunchButtonProps) {
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    if (rippleRef.current) {
      // Trigger the ripple animation
      gsap.fromTo(
        rippleRef.current,
        { scale: 0, opacity: 0.7 },
        { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
    // Trigger the launch action immediately
    onLaunch();
  };

  return (
    <div className="relative">
      <Button
        size="lg"
        className="relative z-10 w-48 h-16 text-lg overflow-hidden"
        onClick={handleClick}
      >
        Launch
        <span
          ref={rippleRef}
          className="absolute block w-full h-full bg-primary/50 rounded-full pointer-events-none"
          style={{ transform: 'scale(0)', opacity: 0 }}
        />
      </Button>
    </div>
  );
}
