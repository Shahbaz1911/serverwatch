import { Server } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-6">
        <Server className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-foreground">
          ServerWatch
        </h1>
      </div>
    </header>
  );
}
