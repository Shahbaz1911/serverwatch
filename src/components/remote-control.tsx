import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './ui/button';

interface RemoteControlProps {
  onPrev: () => void;
  onNext: () => void;
  onOk: () => void;
}

export function RemoteControl({ onPrev, onNext, onOk }: RemoteControlProps) {
  return (
    <div className="fixed bottom-8 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 z-50 flex items-center justify-center">
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-transparent">
        {/* Left Button */}
        <Button
          size="icon"
          onClick={onPrev}
          aria-label="Previous Item"
          className="absolute left-0 h-full w-16 rounded-l-full text-muted-foreground duration-150 flex items-center justify-center bg-transparent hover:bg-transparent"
        >
          <ChevronsLeft className="h-6 w-6" />
        </Button>

        {/* OK Button */}
        <Button
          onClick={onOk}
          aria-label="Select Item"
          className="group z-10 h-16 w-16 rounded-full border-2 border-border bg-background shadow-inner"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 shadow-md transition-colors group-hover:bg-muted">
            {/* OK text removed */}
          </div>
        </Button>

        {/* Right Button */}
        <Button
          size="icon"
          onClick={onNext}
          aria-label="Next Item"
          className="absolute right-0 h-full w-16 rounded-r-full text-muted-foreground duration-150 flex items-center justify-center bg-transparent hover:bg-transparent"
        >
          <ChevronsRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
