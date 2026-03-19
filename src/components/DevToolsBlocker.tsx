'use client';

import { useEffect } from 'react';

export function DevToolsBlocker() {
  useEffect(() => {
    let devToolsOpened = false;

    // Function to redirect to about:blank
    const redirectToBlank = () => {
      if (!devToolsOpened) {
        devToolsOpened = true;
        window.location.href = 'about:blank';
      }
    };

    // ============================================
    // METHOD 2: Disable Keyboard Shortcuts
    // ============================================
    const handleKeyDown = (event: KeyboardEvent) => {
      // F12
      if (event.key === 'F12') {
        event.preventDefault();
        event.stopPropagation();
        redirectToBlank();
        return;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Open Dev Tools)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'I' || event.key === 'i')) {
        event.preventDefault();
        event.stopPropagation();
        redirectToBlank();
        return;
      }

      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'C' || event.key === 'c')) {
        event.preventDefault();
        event.stopPropagation();
        redirectToBlank();
        return;
      }

      // Ctrl+Shift+J / Cmd+Option+J (Open Console)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'J' || event.key === 'j')) {
        event.preventDefault();
        event.stopPropagation();
        redirectToBlank();
        return;
      }

      // Ctrl+U / Cmd+Option+U (View Source)
      if ((event.ctrlKey || event.metaKey) && (event.key === 'U' || event.key === 'u')) {
        event.preventDefault();
        event.stopPropagation();
        redirectToBlank();
        return;
      }
    };

    // ============================================
    // METHOD 6: Developer Tools Detection
    // ============================================

    // Detection 1: Viewport size detection (only for desktop browsers)
    const checkViewportSize = () => {
      // Skip detection on mobile devices to avoid false positives during rotation
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) return;

      const threshold = 160; // Minimum difference to trigger detection
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      // Only trigger if the difference is significant AND both dimensions are affected
      // This helps distinguish dev tools from normal window resizing
      if ((widthDiff > threshold && heightDiff > threshold) || (widthDiff > 300)) {
        redirectToBlank();
      }
    };

    // Detection 2: Performance timing detection
    const checkPerformanceTiming = () => {
      const start = performance.now();
      console.clear();
      const end = performance.now();

      // If clearing console takes too long, dev tools might be open
      if (end - start > 100) {
        redirectToBlank();
      }
    };

    // Detection 3: Console debugger detection
    const checkDebugger = () => {
      const start = Date.now();
      debugger; // This will pause execution if dev tools are open
      const end = Date.now();

      // If execution was paused, dev tools are open
      if (end - start > 100) {
        redirectToBlank();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('resize', checkViewportSize);
    // Removed orientationchange listener to prevent mobile rotation issues

    // Initial checks
    checkViewportSize();
    checkPerformanceTiming();

    // Periodic checks (every 1 second)
    const intervalId = setInterval(() => {
      checkViewportSize();
      checkPerformanceTiming();
      checkDebugger();
    }, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('resize', checkViewportSize);
      clearInterval(intervalId);
    };
  }, []);

  return null; // This component doesn't render anything
}