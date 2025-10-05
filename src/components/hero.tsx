import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-dashboard');

  return (
    <section className="relative mb-12 h-[480px] w-full animate-fade-in-up rounded-lg overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 text-center text-foreground">
        <div className="max-w-4xl">
            <h1 className="font-headline text-5xl font-bold md:text-6xl drop-shadow-lg">
            Your Entire Digital Ecosystem, Unified.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80 drop-shadow-sm">
            Monitor, manage, and analyze all your servers and projects from a single, intuitive dashboard. Welcome to mission control.
            </p>
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
