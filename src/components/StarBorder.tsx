import React from 'react';
import { cn } from '@/lib/utils';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      className={cn(`relative group inline-block overflow-hidden rounded-[20px] transition-transform duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50`, className)}
      {...(rest as any)}
      style={{
        padding: `${thickness}px`,
        ...(rest as any).style
      }}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-0 group-hover:opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-0 group-hover:opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="relative z-1 bg-transparent border border-border group-hover:border-transparent group-hover:bg-gradient-to-b from-card/50 to-card/20 text-foreground text-center text-[16px] py-[16px] px-[26px] rounded-[19px] transition-colors duration-300">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
