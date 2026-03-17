'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  isScrolled?: boolean;
  showSearch?: boolean;
}

export function Header({ onSearch, isScrolled = false, showSearch = true }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setIsSearchOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-zinc-900/95 shadow-lg backdrop-blur-sm' : 'bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-transparent'
      }`}
    >
      <div className="px-3 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="lg:hidden p-2 -ml-2 touch-manipulation text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
              <span className="text-xl sm:text-2xl font-bold text-red-600">BlitarFlix</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 ml-4">
              <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/?type=movie" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Movies
              </Link>
              <Link href="/?type=tv" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                TV Shows
              </Link>
              <Link href="/my-list" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                My List
              </Link>
            </nav>
          </div>

          {/* Right side - Search */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="flex items-center"
                  >
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[150px] sm:w-[250px] pr-10 pl-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-red-500 focus:outline-none text-sm sm:text-base text-white placeholder-gray-400"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 touch-manipulation text-gray-400 hover:text-white"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <button
                    className="p-2 text-gray-300 hover:text-white touch-manipulation"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 lg:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-zinc-900 border-t border-zinc-800 relative z-50"
            >
              <nav className="px-4 py-2">
                <Link 
                  href="/" 
                  className="block py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-lg px-3 transition-colors touch-manipulation"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  href="/?type=movie" 
                  className="block py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-lg px-3 transition-colors touch-manipulation"
                  onClick={closeMobileMenu}
                >
                  Movies
                </Link>
                <Link 
                  href="/?type=tv" 
                  className="block py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-lg px-3 transition-colors touch-manipulation"
                  onClick={closeMobileMenu}
                >
                  TV Shows
                </Link>
                <Link 
                  href="/my-list" 
                  className="block py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-lg px-3 transition-colors touch-manipulation"
                  onClick={closeMobileMenu}
                >
                  My List
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
