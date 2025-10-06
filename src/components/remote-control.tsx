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
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
    >
      <motion.div
        layoutId="remote-control-shape"
        className={cn(
            "relative flex items-center justify-center border-2 border-border transition-all duration-300",
        )}
        initial={{ borderRadius: '9999px', width: '9rem', height: '9rem' }}
        animate={{
            borderRadius: isCapsule ? '9999px' : '9999px',
            width: isCapsule ? '12rem' : '9rem',
            height: isCapsule ? '5rem' : '9rem'
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        {!isCapsule && <span className="absolute top-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</span>}
        
        {/* Left Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            <ChevronsLeft className="h-6 w-6" />
          </Button>
        </motion.div>


        {/* OK / X Button */}
        <motion.div
          layoutId="remote-ok-button"
          onClick={onOk}
          aria-label={isCapsule ? "Go back" : "Select Item"}
          className="group z-10 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
           <div className="h-full w-full rounded-full border-2 border-border bg-background shadow-inner flex items-center justify-center cursor-pointer transition-colors group-hover:bg-muted">
             <motion.div
                key={isCapsule ? 'x' : 'ok'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
             >
                {isCapsule && <X className="h-6 w-6" />}
             </motion.div>
           </div>
        </motion.div>

        {/* Right Button */}
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            <ChevronsRight className="h-6 w-6" />
            </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
