'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface LaunchButtonProps {
  onLaunch: () => void;
}

export function LaunchButton({ onLaunch }: LaunchButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rocketRef = useRef<HTMLSpanElement>(null);
  const smokeContainerRef = useRef<HTMLDivElement>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleMouseEnter = () => {
    if (!buttonRef.current || !smokeContainerRef.current || isLaunching) return;

    gsap.to(buttonRef.current, {
      rotation: -5,
      duration: 0.3,
      ease: 'power2.out',
    });

    const smokeParticles = smokeContainerRef.current.children;
    gsap.fromTo(
      smokeParticles,
      { opacity: 0, y: 10, scale: 0.5 },
      {
        opacity: 0.7,
        y: -20,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current || !smokeContainerRef.current || isLaunching) return;

    gsap.to(buttonRef.current, {
      rotation: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });

    const smokeParticles = smokeContainerRef.current.children;
    gsap.to(smokeParticles, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  };

  const handleClick = () => {
    if (!rocketRef.current || isLaunching) return;

    setIsLaunching(true);

    gsap.timeline({
      onComplete: () => {
        onLaunch();
        // Reset state after animation and navigation
        setTimeout(() => {
            if (rocketRef.current) {
               gsap.set(rocketRef.current, { y: 0, scale: 1, opacity: 1 });
            }
            setIsLaunching(false);
        }, 500);
      },
    }).to(rocketRef.current, {
      scale: 1.5,
      duration: 0.2,
      ease: 'power2.out',
    }).to(rocketRef.current, {
      y: '-200vh',
      opacity: 0,
      duration: 1.0,
      ease: 'power2.in',
    });
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={smokeContainerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 pointer-events-none"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-4 h-4 bg-muted-foreground/50 rounded-full opacity-0"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
      <Button
        ref={buttonRef}
        size="lg"
        className="relative z-10 w-48 h-16 text-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={isLaunching}
      >
        <span ref={rocketRef} className="inline-block">
            <Rocket className="mr-2 h-6 w-6" />
        </span>
        {isLaunching ? 'Launching...' : 'Launch'}
      </Button>
    </div>
  );
}
