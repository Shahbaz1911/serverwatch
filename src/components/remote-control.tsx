import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/button';

interface RemoteControlProps {
  onPrev: () => void;
  onNext: () => void;
  onOk: () => void;
}

export function RemoteControl({ onPrev, onNext, onOk }: RemoteControlProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm border border-border">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onPrev} aria-label="Previous Item">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          onClick={onOk}
          aria-label="Select Item"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 w-12"
        >
          <Check className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} aria-label="Next Item">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
