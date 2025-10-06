import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface RemoteControlProps {
  onPrev: () => void;
  onNext: () => void;
  onOk: () => void;
}

export function RemoteControl({ onPrev, onNext, onOk }: RemoteControlProps) {
  return (
    <div className="fixed bottom-8 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 z-50 flex items-center justify-center">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-border bg-background/80 shadow-2xl backdrop-blur-sm">
        {/* Left Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          aria-label="Previous Item"
          className="absolute left-0 h-full w-14 rounded-l-full text-muted-foreground hover:bg-accent/50"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* OK Button */}
        <Button
          onClick={onOk}
          aria-label="Select Item"
          className="z-10 h-16 w-16 rounded-full border-2 border-border bg-background shadow-inner hover:bg-accent"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 shadow-md">
            {/* OK text removed */}
          </div>
        </Button>

        {/* Right Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          aria-label="Next Item"
          className="absolute right-0 h-full w-14 rounded-r-full text-muted-foreground hover:bg-accent/50"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
