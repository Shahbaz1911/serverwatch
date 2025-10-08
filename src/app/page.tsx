"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import LiquidEther from '@/components/liquid-ether';
import Link from "next/link";
import { LaunchButton } from "@/components/launch-button";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Authentication service not available.",
            description: "Please try again later.",
        });
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
            variant: "success",
            title: "Login Successful",
            description: "Redirecting you to the dashboard...",
        });
        setIsSuccess(true);
        setTimeout(() => {
             // The useEffect will handle the redirect, this just ensures animation completes
             if (user) router.push("/dashboard");
        }, 800)
    } catch (error) {
        setShake(true);
        setTimeout(() => setShake(false), 500);

        let errorMessage = "An unknown error occurred.";
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address.";
                    break;
                default:
                    errorMessage = "Failed to log in. Please try again.";
                    break;
            }
        }
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorMessage,
        });
    }
  }
  
  if (isUserLoading || (user && !isSuccess)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-press-start text-2xl font-bold animate-pulse">ServerWatch</span>
      </div>
    );
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
    initial: { x: 0 }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
       <AnimatePresence>
        {!user && isMounted && (
            <motion.div
                variants={shakeVariants}
                animate={shake ? 'shake' : 'initial'}
                className="z-10 w-full max-w-sm"
            >
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                >
                    <Card className="w-full bg-background/80 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="font-press-start text-2xl font-bold">ServerWatch</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="name@example.com" {...field} className="pl-10" />
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="••••••••" 
                                            {...field} 
                                            className="pl-10 pr-10" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-end text-sm">
                                <Link href="#" className="text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                            </Button>
                            </form>
                        </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        )}
       </AnimatePresence>
    </div>
  );
}
