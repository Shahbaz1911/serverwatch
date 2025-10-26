"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import LiquidEther from '@/components/liquid-ether';
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedTick } from "@/components/ui/animated-tick";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isUserLoading && user && !loginSuccess) {
      // If user is already logged in and we haven't just shown the success animation
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router, loginSuccess]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Authentication service not available.",
            description: "Please try again later.",
        });
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        setLoginSuccess(true);
        // Delay redirect to show success animation
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
    } catch (error) {
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
        // Reset to email step on failure
        setStep('email');
        setEmail('');
        setPassword('');
    }
  };
  
  if (isUserLoading || (!isMounted && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-press-start text-2xl font-bold animate-pulse">ServerWatch</span>
      </div>
    );
  }

  const emailPlaceholders = [
    "What's your email address?",
    "Enter your email to sign in",
    "Your email goes here...",
    "john.doe@example.com",
  ];

  const passwordPlaceholders = [
    "Now, your password.",
    "Enter your password to continue",
    "Keep it secret, keep it safe.",
    "••••••••••••"
  ];


  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
       <div className="absolute inset-0 z-0">
         <LiquidEther
          colors={[ '#a7a2b3', '#1CBB9C', '#A3F0E3' ]}
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
      <AnimatePresence mode="wait">
        {!loginSuccess ? (
             <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="z-10 w-full flex flex-col items-center"
            >
                <h1 className="mb-12 font-press-start text-3xl md:text-5xl font-bold text-center z-10">ServerWatch</h1>
                <div className="z-10 w-full max-w-xl">
                    {step === 'email' ? (
                    <PlaceholdersAndVanishInput
                        placeholders={emailPlaceholders}
                        onChange={handleEmailChange}
                        onSubmit={handleEmailSubmit}
                    />
                    ) : (
                    <PlaceholdersAndVanishInput
                        placeholders={passwordPlaceholders}
                        onChange={handlePasswordChange}
                        onSubmit={handlePasswordSubmit}
                        type="password"
                    />
                    )}
                </div>
            </motion.div>
        ) : (
            <motion.div
                key="success-tick"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                className="z-10"
            >
                <AnimatedTick />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
