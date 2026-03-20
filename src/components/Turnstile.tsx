'use client';

import TurnstileWidget from 'react-turnstile';
import { useTurnstile } from './TurnstileProvider';

interface TurnstileProps {
  onSuccess?: () => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
  const { verifyToken } = useTurnstile();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined');
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <TurnstileWidget
        sitekey={siteKey}
        onSuccess={async (token: string) => {
          const isValid = await verifyToken(token);
          if (isValid) {
            onSuccess?.();
          } else {
            onError?.();
          }
        }}
        onError={() => {
          console.error('Turnstile error');
          onError?.();
        }}
        onExpire={() => {
          console.log('Turnstile expired');
          onExpire?.();
        }}
        size="invisible"
      />
    </div>
  );
}
