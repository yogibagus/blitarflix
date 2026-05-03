'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Play, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecureVideoPlayerProps {
  url: string;
  onClose: () => void;
  title?: string;
}

export function SecureVideoPlayer({ url, onClose, title }: SecureVideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Block popup/new tab ads while player is active
  useEffect(() => {
    const originalOpen = window.open;
    window.open = function() {
      return null;
    };

    // Block navigation via window.location changes from iframe
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.open = originalOpen;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showConfirmClose) {
          setShowConfirmClose(false);
        } else {
          setShowConfirmClose(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmClose]);

  // Handle click to dismiss overlay
  const handleClick = useCallback(() => {
    if (clickCount === 0) {
      setClickCount(1);
    } else if (clickCount === 1) {
      setIsReady(true);
    }
  }, [clickCount]);

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
        onClick={() => setShowConfirmClose(true)}
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

      {/* Click hint */}
      {!isReady && (
        <div className="absolute top-3 right-16 sm:top-4 sm:right-20 z-20">
          <div className="bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            {clickCount === 0 ? 'Tap to continue' : 'Tap again to play'}
          </div>
        </div>
      )}

      {/* Click overlay - captures first click(s) */}
      <AnimatePresence>
        {!isReady && (
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

      {/* Iframe for video playback - sandbox blocks popups (no allow-popups) */}
      <iframe
        src={url}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          pointerEvents: isReady ? 'auto' : 'none'
        }}
      />

      {/* Close confirmation modal */}
      <AnimatePresence>
        {showConfirmClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmClose(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 sm:p-8 mx-4 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-white text-lg font-semibold">Close Video?</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-6">
                Are you sure you want to close the video player? Your current playback will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors touch-manipulation"
                  onClick={() => setShowConfirmClose(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors touch-manipulation"
                  onClick={onClose}
                >
                  Yes, Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}