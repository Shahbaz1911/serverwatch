import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Status } from "./status-dot";
import { StatusDot } from "./status-dot";
import { GlassIcon } from "./glass-icon";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { ArrowUpRight, Timer, ToyBrick } from "lucide-react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

type ServerCardProps = {
  name: string;
  url: string;
  icon: LucideIcon;
  status: Status;
  animationDelay: number;
  color?: string;
  port?: number;
  uptime?: string;
  isSelected?: boolean;
};

export const ServerCard = React.forwardRef<HTMLDivElement, ServerCardProps>(
  ({ name, url, icon: Icon, status, animationDelay, color = 'blue', port, uptime, isSelected = false }, ref) => {
    const isLoading = status === 'loading';

    const handleOpenClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
      <div
        ref={ref}
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: `${animationDelay}s` }}
      >
          <Card className={cn(
            "h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col border-2",
            isSelected ? 'border-primary shadow-2xl -translate-y-1' : 'border-transparent hover:border-accent'
            )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      {isLoading ? (
                          <>
                              <Skeleton className="h-[3em] w-[3em] rounded-[1.25em]" />
                              <Skeleton className="h-6 w-32" />
                          </>
                      ) : (
                          <>
                              <GlassIcon icon={<Icon className="w-[1.5em] h-[1.5em]" />} color={color} label={name} />
                              <CardTitle className="font-headline text-lg">{name}</CardTitle>
                          </>
                      )}
                  </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {isLoading ? (
                  <div className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-28 mt-2" />
                  </div>
              ) : (
                  <>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <ToyBrick className="h-4 w-4 text-primary"/>
                          <span>Port: {port || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Timer className="h-4 w-4 text-primary"/>
                          <span>Uptime: {uptime || 'N/A'}</span>
                      </div>
                      <StatusDot status={status} />
                  </>
              )}
            </CardContent>
            <Separator />
            <CardFooter className="p-4">
              {isLoading ? (
                  <Skeleton className="h-9 w-full" />
              ) : (
                  <Button variant="ghost" className="w-full" onClick={handleOpenClick}>
                      Open
                      <ArrowUpRight className="ml-2 h-4 w-4"/>
                  </Button>
              )}
            </CardFooter>
          </Card>
      </div>
    );
  }
);

ServerCard.displayName = "ServerCard";
