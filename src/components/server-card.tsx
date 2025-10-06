import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Status } from "./status-dot";
import { GlassIcon } from "./glass-icon";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { StatusDot } from "./status-dot";
import { ArrowUpRight } from "lucide-react";

type ServerCardProps = {
  name: string;
  url: string;
  icon: LucideIcon;
  status: Status;
  animationDelay: number;
  color?: string;
  isSelected?: boolean;
  port?: number;
  uptime?: string;
};

export const ServerCard = React.forwardRef<HTMLDivElement, ServerCardProps>(
  ({ name, url, icon: Icon, status, animationDelay, color = 'blue', isSelected = false, port, uptime }, ref) => {
    const isLoading = status === 'loading';

    const handleOpenLink = () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    const cardContent = (
      <CardContent className="p-0 flex flex-col items-center gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[3em] w-[3em] rounded-[1.25em]" />
            <Skeleton className="h-6 w-32" />
          </>
        ) : (
          <>
            <GlassIcon icon={<Icon className="w-[1.5em] h-[1.5em]" />} color={color} label={name} isSelected={isSelected} />
            <span className="font-headline text-lg text-center">{name}</span>
          </>
        )}
      </CardContent>
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <div
            ref={ref}
            className="animate-fade-in-up opacity-0 h-full"
            style={{ animationDelay: `${animationDelay}s` }}
          >
            <Card className={cn(
              "h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center items-center p-6 cursor-pointer border-2 min-h-[180px]",
              isSelected ? "border-accent" : "border-transparent"
            )}>
              {cardContent}
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Icon className="h-6 w-6" />
              {name}
            </DialogTitle>
            <DialogDescription>
              Detailed status for {name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusDot status={status} />
            </div>
            {port && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Port</span>
                <span className="font-mono text-foreground">{port}</span>
              </div>
            )}
            {uptime && (
               <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-mono text-foreground">{uptime}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleOpenLink}>
              Open Service <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

ServerCard.displayName = "ServerCard";
