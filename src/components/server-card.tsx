import React from "react";
import Link from 'next/link';
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Status } from "./status-dot";
import { GlassIcon } from "./glass-icon";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ServerCardProps = {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  status: Status;
  animationDelay: number;
  color?: string;
  isSelected?: boolean;
};

export const ServerCard = React.forwardRef<HTMLDivElement, ServerCardProps>(
  ({ id, name, icon: Icon, status, animationDelay, color = 'blue', isSelected = false }, ref) => {
    const isLoading = status === 'loading';

    const cardContent = (
       <CardContent className="p-0 flex flex-col items-center gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[3em] w-[3em] rounded-[1.25em]" />
            <Skeleton className="h-6 w-32" />
          </>
        ) : (
          <>
             <motion.div layoutId={`card-container-${id}`}>
                 <GlassIcon icon={<Icon className="w-[1.5em] h-[1.5em]" />} color={color} label={name} isSelected={isSelected} />
             </motion.div>
            <span className="font-headline text-lg text-center">{name}</span>
          </>
        )}
      </CardContent>
    );

    return (
        <motion.div
            ref={ref}
            className="animate-fade-in-up opacity-0 h-full"
            style={{ animationDelay: `${animationDelay}s` }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Link href={`/dashboard/app/${id}`} className="h-full block">
                <Card className={cn(
                "h-full transition-all duration-300 flex flex-col justify-center items-center p-6 cursor-pointer border-2 min-h-[180px]",
                 isSelected ? "border-accent" : "border-transparent"
                )}>
                {cardContent}
                </Card>
            </Link>
        </motion.div>
    );
  }
);

ServerCard.displayName = "ServerCard";
