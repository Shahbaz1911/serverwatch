import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Aurora from './aurora';


export function Hero() {
  return (
    <section className="relative mb-12 h-auto w-full animate-fade-in-up rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-accent/10 py-20 md:py-24">
      <div className="absolute inset-0 z-0">
        <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
        />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center text-foreground">
        <div className="max-w-4xl">
            <h1 className="font-headline text-5xl font-bold md:text-6xl drop-shadow-lg">
            Your Entire Digital Ecosystem, Unified.
            </h1>
            
            <Button asChild size="lg" className="mt-8">
            <Link href="#system-overview">
                Check System Health <ArrowRight className="ml-2" />
            </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
