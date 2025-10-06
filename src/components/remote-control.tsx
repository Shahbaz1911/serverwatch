import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface RemoteControlProps {
  onPrev: () => void;
  onNext: () => void;
  onOk: () => void;
}

export function RemoteControl({ onPrev, onNext, onOk }: RemoteControlProps) {
  return (
    <div className="fixed bottom-8 right-1/2 translate-x-1/2 z-50 flex items-center justify-center">
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-border">
        <span className="absolute top-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</span>
        {/* Left Button */}
        <Button
          size="icon"
          onClick={onPrev}
          aria-label="Previous Item"
          className="absolute left-0 h-full w-16 rounded-l-full bg-transparent text-muted-foreground duration-150 hover:bg-transparent flex items-center justify-center"
        >
          <ChevronsLeft className="h-6 w-6" />
        </Button>

        {/* OK Button */}
        <div
          onClick={onOk}
          aria-label="Select Item"
          className={cn(
            "group z-10 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          )}
        >
           <div className="h-full w-full rounded-full border-2 border-border bg-background shadow-inner flex items-center justify-center cursor-pointer transition-colors group-hover:bg-muted" />
        </div>

        {/* Right Button */}
        <Button
          size="icon"
          onClick={onNext}
          aria-label="Next Item"
          className="absolute right-0 h-full w-16 rounded-r-full bg-transparent text-muted-foreground duration-150 hover:bg-transparent flex items-center justify-center"
        >
          <ChevronsRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
