'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function NotFound() {
  const { tt } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-8xl sm:text-9xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {tt('notFound.title')}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 px-4">
            {tt('notFound.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <Home className="h-5 w-5" />
                {tt('notFound.goBackHome')}
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {tt('notFound.goBack')}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              {tt('notFound.whatToWatch')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/browse/movie">
                <button className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-4 rounded-lg font-semibold transition-colors border border-zinc-800 hover:border-zinc-700">
                  <Search className="h-5 w-5" />
                  {tt('notFound.browseMovies')}
                </button>
              </Link>
              <Link href="/browse/tv">
                <button className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-4 rounded-lg font-semibold transition-colors border border-zinc-800 hover:border-zinc-700">
                  <Search className="h-5 w-5" />
                  {tt('notFound.browseTV')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-zinc-900 border-t border-zinc-800 py-6">
        <div className="px-4 sm:px-8 lg:px-16 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2">BlitarFlix</h3>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto mb-2 px-4">
            {tt('footer.disclaimer')}
          </p>
          <a href="mailto:contact@blitarflix.com" className="text-zinc-400 text-xs sm:text-sm hover:text-red-500 transition-colors">
            contact@blitarflix.com
          </a>
        </div>
      </footer>
    </div>
  );
}