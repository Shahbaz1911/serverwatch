"use client";

import React from 'react';

interface ChatBubbleProps {
  children: React.ReactNode;
}

export function ChatBubble({ children }: ChatBubbleProps) {
  return (
    <div className="relative inline-block">
      <div className="rounded-lg bg-card/70 backdrop-blur-sm px-4 py-2 text-foreground shadow-lg">
        <p className="text-base uppercase font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {children}
            </span>
        </p>
      </div>
      <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-card/70"></div>
    </div>
  );
}
