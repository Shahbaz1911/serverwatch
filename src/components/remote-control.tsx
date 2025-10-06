import { useEffect, useRef } from 'react';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface RemoteControlProps {
  onPrev: () => void;
  onNext: () => void;
  onOk: () => void;
  variant?: 'circle' | 'capsule';
}

export function RemoteControl({ onPrev, onNext, onOk, variant = 'circle' }: RemoteControlProps) {
  const isCapsule = variant === 'capsule';
  const shapeRef = useRef<HTMLDivElement>(null);
  const okButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shapeRef.current && okButtonRef.current) {
        gsap.to(shapeRef.current, {
            borderRadius: '9999px',
            width: isCapsule ? '14rem' : '11rem',
            height: isCapsule ? '6rem' : '11rem',
            duration: 0.5,
            ease: 'power3.inOut'
        });

        gsap.to(okButtonRef.current, {
          rotate: 0,
          opacity: 1,
          duration: 0.2,
        })
    }
  }, [isCapsule]);


  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
    >
      <div
        ref={shapeRef}
        className={cn(
            "relative flex items-center justify-center border-2 border-border transition-all duration-300",
            "w-[11rem] h-[11rem] rounded-full"
        )}
      >
        
        {/* Left Button */}
        <div
          className={cn(
            "absolute h-full flex items-center justify-center",
            isCapsule ? "left-2 w-16" : "left-0 w-16"
          )}
        >
          <Button
            size="icon"
            onClick={onPrev}
            aria-label="Previous Item"
            className="h-full bg-transparent text-muted-foreground duration-150 hover:bg-transparent"
          >
            <ChevronsLeft className="h-8 w-8" />
          </Button>
        </div>


        {/* OK / X Button */}
        <div
          ref={okButtonRef}
          onClick={onOk}
          aria-label={isCapsule ? "Go back" : "Select Item"}
          className="group z-10 h-16 w-16 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
           <div className="h-full w-full rounded-full border-2 border-border bg-background shadow-inner flex items-center justify-center cursor-pointer transition-colors group-hover:bg-muted">
             <div
             >
                {isCapsule && <X className="h-8 w-8" />}
             </div>
           </div>
        </div>

        {/* Right Button */}
         <div
          className={cn(
            "absolute h-full flex items-center justify-center",
            isCapsule ? "right-2 w-16" : "right-0 w-16"
          )}
        >
            <Button
            size="icon"
            onClick={onNext}
            aria-label="Next Item"
            className="h-full bg-transparent text-muted-foreground duration-150 hover:bg-transparent"
            >
            <ChevronsRight className="h-8 w-8" />
            </Button>
        </div>
      </div>
    </div>
  );
}
