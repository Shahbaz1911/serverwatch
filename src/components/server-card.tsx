import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Status } from "./status-dot";
import { GlassIcon } from "./glass-icon";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type ServerCardProps = {
  name: string;
  url: string;
  icon: LucideIcon;
  status: Status;
  animationDelay: number;
  color?: string;
  isSelected?: boolean;
};

export const ServerCard = React.forwardRef<HTMLDivElement, ServerCardProps>(
  ({ name, url, icon: Icon, status, animationDelay, color = 'blue', isSelected = false }, ref) => {
    const isLoading = status === 'loading';

    const handleCardClick = () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
      <div
        ref={ref}
        className="animate-fade-in-up opacity-0 h-full"
        style={{ animationDelay: `${animationDelay}s` }}
        onClick={!isLoading ? handleCardClick : undefined}
      >
        <Card className={cn(
          "h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center items-center p-6 cursor-pointer border-2 min-h-[180px]",
          isSelected ? 'border-primary shadow-2xl -translate-y-1' : 'border-transparent hover:border-accent'
        )}>
          <CardContent className="p-0 flex flex-col items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-[3em] w-[3em] rounded-[1.25em]" />
                <Skeleton className="h-6 w-32" />
              </>
            ) : (
              <>
                <GlassIcon icon={<Icon className="w-[1.5em] h-[1.5em]" />} color={color} label={name} />
                <span className="font-headline text-lg text-center">{name}</span>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

ServerCard.displayName = "ServerCard";
