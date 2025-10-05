'use client';
    
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If auth is not available, we are not loading and there's no user.
    if (!auth) {
      setUser(null);
      setIsLoading(false);
      setError(new Error("Firebase Auth instance is not available."));
      return;
    }

    // Set initial state based on currentUser, but still listen for changes.
    setIsLoading(true);
    setUser(auth.currentUser);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        setUser(firebaseUser);
        setIsLoading(false);
        setError(null);
      },
      (err: Error) => {
        console.error("useUser - onAuthStateChanged error:", err);
        setError(err);
        setUser(null);
        setIsLoading(false);
      }
    );

    // Initial check might finish before listener is set, so we re-set loading false.
    if (auth.currentUser !== undefined) {
        setIsLoading(false);
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isLoading, error };
}
