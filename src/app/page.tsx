"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import LiquidEther from '@/components/liquid-ether';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

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
        toast({
            variant: "success",
            title: "Login Successful",
            description: "Redirecting you to the dashboard...",
        });
        // The useEffect will handle the redirect
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
  
  if (isUserLoading || (user && isMounted)) {
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
    </div>
  );
}
