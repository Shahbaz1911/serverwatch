'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import StarBorder from './StarBorder';
import { cn } from '@/lib/utils';

interface LaunchButtonProps {
  onLaunch: () => void;
  className?: string;
}

export const LaunchButton: React.FC<LaunchButtonProps> = ({ onLaunch, className }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const glow = glowRef.current;
    const particleContainer = particleContainerRef.current;
    if (!button || !glow || !particleContainer) return;

    // Create particles
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-primary rounded-full';
      particleContainer.appendChild(particle);
      particles.push(particle);
      gsap.set(particle, { x: 0, y: 0, opacity: 0 });
    }

    const tlHover = gsap.timeline({ paused: true });
    tlHover
      .to(button, { y: -6, scale: 1.05, duration: 0.3, ease: 'power2.out' })
      .to(glow, { opacity: 0.4, scale: 1.5, duration: 0.3, ease: 'power2.out' }, 0);

    const handleMouseEnter = () => tlHover.play();
    const handleMouseLeave = () => tlHover.reverse();

    const handleClick = () => {
      // Button press animation
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

      // Particle explosion
      particles.forEach(p => {
        gsap.fromTo(p, 
            { opacity: 1, scale: 1, x: 0, y: 0 }, 
            {
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 120,
                opacity: 0,
                scale: 0,
                duration: 0.6,
                ease: 'power2.out',
            }
        );
      });
      
      // Delay launch to allow animation to be seen
      setTimeout(onLaunch, 300);
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
      // Clean up particles
      if (particleContainer) {
        particleContainer.innerHTML = '';
      }
    };
  }, [onLaunch]);

  return (
    <div ref={buttonRef} className={cn("relative w-full max-w-xs mx-auto", className)}>
        <div ref={glowRef} className="absolute inset-0 bg-primary rounded-full blur-xl opacity-0" />
        <div ref={particleContainerRef} className="absolute inset-0 flex items-center justify-center" />
        <StarBorder
            as="button"
            color="hsl(var(--primary))"
            speed="3s"
        >
            Launch
        </StarBorder>
    </div>
  );
};
