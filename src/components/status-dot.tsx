import { cn } from "@/lib/utils";

export type Status = 'online' | 'offline' | 'loading';

type StatusDotProps = {
  status: Status;
};

export function StatusDot({ status }: StatusDotProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("h-3 w-3 rounded-full", {
          "bg-chart-2": status === "online",
          "bg-destructive": status === "offline",
          "bg-muted-foreground animate-pulse": status === "loading",
        })}
      />
      <span className="text-sm font-medium capitalize text-muted-foreground">{status}</span>
    </div>
  );
}
