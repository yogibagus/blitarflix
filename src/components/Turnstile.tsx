'use client';

import TurnstileWidget from 'react-turnstile';
import { useTurnstile } from './TurnstileProvider';
import { useEffect, useState } from 'react';

interface TurnstileProps {
  onSuccess?: () => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
  const { verifyToken } = useTurnstile();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    // Give the widget time to load
    const timer = setTimeout(() => {
      setIsWidgetReady(true);
      console.log('Turnstile widget is ready');
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!siteKey) {
    console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined');
    return null;
  }

  if (!isWidgetReady) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading security verification...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[65px]">
      <TurnstileWidget
        sitekey={siteKey}
        onSuccess={async (token: string) => {
          console.log('Turnstile token received, verifying...');
          const isValid = await verifyToken(token);
          if (isValid) {
            console.log('Turnstile verification successful');
            onSuccess?.();
          } else {
            console.error('Turnstile verification failed');
            onError?.();
          }
        }}
        onError={(error: any) => {
          console.error('Turnstile widget error:', error);
          onError?.();
        }}
        onExpire={() => {
          console.log('Turnstile expired');
          onExpire?.();
        }}
        size="normal"
        theme="dark"
      />
    </div>
  );
}
