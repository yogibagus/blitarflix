'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Play, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTurnstile } from './TurnstileProvider';
import { Turnstile } from './Turnstile';

interface SecureVideoPlayerProps {
  url: string;
  onClose: () => void;
  title?: string;
}

export function SecureVideoPlayer({ url, onClose, title }: SecureVideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { isVerified, isLoading } = useTurnstile();
  const [turnstileKey, setTurnstileKey] = useState(0);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset turnstile when component mounts
  useEffect(() => {
    setTurnstileKey(prev => prev + 1);
  }, []);

  // Handle click to dismiss overlay
  const handleClick = useCallback(() => {
    if (!isVerified) return;
    
    if (clickCount === 0) {
      setClickCount(1);
    } else if (clickCount === 1) {
      setIsReady(true);
    }
  }, [clickCount, isVerified]);

  const handleTurnstileSuccess = useCallback(() => {
    console.log('Turnstile verification completed in SecureVideoPlayer');
    // Verification successful, user can now proceed
  }, []);

  const handleTurnstileError = useCallback(() => {
    console.error('Turnstile verification failed in SecureVideoPlayer, retrying...');
    // Turnstile widget will automatically retry
    setTurnstileKey(prev => prev + 1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Close button */}
      <button
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 h-10 w-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-white flex items-center justify-center touch-manipulation"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      {/* Title badge */}
      {title && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
          <div className="bg-zinc-800/90 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full max-w-[200px] sm:max-w-[300px] truncate">
            {title}
          </div>
        </div>
      )}

      {/* Security Verification Overlay */}
      <AnimatePresence>
        {!isVerified && !isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/95"
          >
            <div className="text-center px-4 max-w-md">
              {isLoading ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white"
                >
                  <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verifying Security</h3>
                  <p className="text-zinc-400 text-sm">Please wait while we verify you're human...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white"
                >
                  <div className="h-20 w-20 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Security Verification</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    We need to verify you're human before playing this video.
                  </p>
                  <Turnstile 
                    key={turnstileKey}
                    onSuccess={handleTurnstileSuccess}
                    onError={handleTurnstileError}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click hint */}
      {!isReady && isVerified && (
        <div className="absolute top-3 right-16 sm:top-4 sm:right-20 z-20">
          <div className="bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            {clickCount === 0 ? 'Tap to continue' : 'Tap again to play'}
          </div>
        </div>
      )}

      {/* Click overlay - captures first click(s) */}
      <AnimatePresence>
        {!isReady && isVerified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-black/40"
            onClick={handleClick}
          >
            {clickCount === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center pointer-events-none"
              >
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center mx-auto mb-3">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 fill-red-500" />
                </div>
                <p className="text-white text-base sm:text-lg font-semibold">
                  {title || 'Tap to Play'}
                </p>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                  Tap 2x to start video
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Iframe with sandbox - blocks popups but allows video playback */}
      <iframe
        src={url}
        className="w-full h-full border-0"
        // Sandbox allows essential features but blocks:
        // - popups (no allow-popups)
        // - top navigation (no allow-top-navigation)
        // - opening new windows
        sandbox="allow-scripts allow-same-origin allow-forms"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          pointerEvents: isReady ? 'auto' : 'none'
        }}
      />
    </motion.div>
  );
}
