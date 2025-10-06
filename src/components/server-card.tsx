import React, { useState } from "react";
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const cardContent = (
       <CardContent className="p-0 flex flex-col items-center gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-16 rounded-[1.25em]" />
            <Skeleton className="h-6 w-32" />
          </>
        ) : (
          <>
             <motion.div layoutId={`card-container-${id}`} onClick={() => router.push(`/dashboard/app/${id}`)} className="cursor-pointer">
                 <GlassIcon 
                    icon={<Icon className="w-full h-full" />} 
                    color={color} 
                    label={name} 
                    isSelected={isSelected || isHovered}
                    customClass="w-16 h-16"
                 />
             </motion.div>
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card className={cn(
            "h-full transition-all duration-300 flex flex-col justify-center items-center p-6 border-2 min-h-[180px] border-transparent",
            )}>
            {cardContent}
            </Card>
        </motion.div>
    );
  }
);

ServerCard.displayName = "ServerCard";
