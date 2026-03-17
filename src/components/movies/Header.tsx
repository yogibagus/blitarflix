'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSearch?: (query: string) => void;
  isScrolled?: boolean;
}

export function Header({ onSearch, isScrolled }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/?type=movie' },
    { label: 'TV Shows', href: '/?type=tv' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-gradient-to-b from-white via-white/80 to-transparent'
      }`}
    >
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-red-600">BlitarFlix</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Genre Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-red-600 gap-1">
                    Genres <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 max-h-80 overflow-y-auto">
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=28">Action</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=12">Adventure</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=16">Animation</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=35">Comedy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=80">Crime</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=99">Documentary</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=18">Drama</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=10751">Family</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=14">Fantasy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=36">History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=27">Horror</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=10402">Music</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=9648">Mystery</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=10749">Romance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=878">Science Fiction</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=53">Thriller</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=10752">War</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?genre=37">Western</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center">
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
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search movies, TV shows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[200px] sm:w-[280px] pr-10 bg-white/90 border-gray-300 focus:border-red-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-red-600"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <nav className="px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 text-base font-medium text-gray-700 hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t mt-3">
                <p className="text-xs text-gray-500 uppercase mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 28, name: 'Action' },
                    { id: 35, name: 'Comedy' },
                    { id: 18, name: 'Drama' },
                    { id: 27, name: 'Horror' },
                    { id: 10749, name: 'Romance' },
                    { id: 878, name: 'Sci-Fi' },
                  ].map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/?genre=${genre.id}`}
                      className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 hover:bg-red-100 hover:text-red-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
