import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Status } from "./status-dot";
import { StatusDot } from "./status-dot";
import { GlassIcon } from "./glass-icon";
import { Skeleton } from "./ui/skeleton";

type ServerCardProps = {
  name: string;
  url: string;
  icon: LucideIcon;
  status: Status;
  animationDelay: number;
  color?: string;
};

export function ServerCard({ name, url, icon: Icon, status, animationDelay, color = 'blue' }: ServerCardProps) {
  const isLoading = status === 'loading';

  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${animationDelay}s` }}
    >
        <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent">
          <CardHeader>
             <a href={isLoading ? undefined : url} target="_blank" rel="noopener noreferrer" className={`block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg ${isLoading ? 'pointer-events-none' : ''}`}>
                <div className="flex flex-col gap-4">
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
                    <StatusDot status={status} />
                </div>
            </a>
          </CardHeader>
        </Card>
    </div>
  );
}
