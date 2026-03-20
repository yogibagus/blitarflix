'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TurnstileContextType {
  isVerified: boolean;
  verifyToken: (token: string) => Promise<boolean>;
  resetVerification: () => void;
  isLoading: boolean;
}

const TurnstileContext = createContext<TurnstileContextType | undefined>(undefined);

export function useTurnstile() {
  const context = useContext(TurnstileContext);
  if (!context) {
    throw new Error('useTurnstile must be used within TurnstileProvider');
  }
  return context;
}

interface TurnstileProviderProps {
  children: ReactNode;
}

export function TurnstileProvider({ children }: TurnstileProviderProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyToken = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsVerified(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Turnstile verification failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetVerification = useCallback(() => {
    setIsVerified(false);
  }, []);

  return (
    <TurnstileContext.Provider value={{ isVerified, verifyToken, resetVerification, isLoading }}>
      {children}
    </TurnstileContext.Provider>
  );
}