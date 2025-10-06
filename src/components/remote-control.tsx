import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RemoteControlProps {
  onPrev: () => void;
  onNext: () => void;
  onOk: () => void;
  variant?: 'circle' | 'capsule';
}

export function RemoteControl({ onPrev, onNext, onOk, variant = 'circle' }: RemoteControlProps) {
  const isCapsule = variant === 'capsule';

  return (
    <motion.div 
      layoutId="remote-control-container"
      className="fixed bottom-8 right-1/2 translate-x-1/2 z-50 flex items-center justify-center"
    >
      <motion.div
        layoutId="remote-control-shape"
        className={cn(
            "relative flex items-center justify-center border-2 border-border transition-all duration-300",
            isCapsule ? "h-20 w-48 rounded-full" : "h-36 w-36 rounded-full"
        )}
        initial={{ borderRadius: '9999px' }}
        animate={{ borderRadius: isCapsule ? '9999px' : '9999px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        {!isCapsule && <span className="absolute top-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</span>}
        
        {/* Left Button */}
        <Button
          size="icon"
          onClick={onPrev}
          aria-label="Previous Item"
          className={cn(
            "absolute h-full bg-transparent text-muted-foreground duration-150 hover:bg-transparent flex items-center justify-center",
            isCapsule ? "left-2 w-16" : "left-0 w-16 rounded-l-full"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </Button>

        {/* OK / X Button */}
        <motion.div
          layoutId="remote-ok-button"
          onClick={onOk}
          aria-label={isCapsule ? "Go back" : "Select Item"}
          className="group z-10 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
           <div className="h-full w-full rounded-full border-2 border-border bg-background shadow-inner flex items-center justify-center cursor-pointer transition-colors group-hover:bg-muted">
             {isCapsule && <X className="h-6 w-6" />}
           </div>
        </motion.div>

        {/* Right Button */}
        <Button
          size="icon"
          onClick={onNext}
          aria-label="Next Item"
          className={cn(
            "absolute h-full bg-transparent text-muted-foreground duration-150 hover:bg-transparent flex items-center justify-center",
            isCapsule ? "right-2 w-16" : "right-0 w-16 rounded-r-full"
          )}
        >
          <ChevronsRight className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
