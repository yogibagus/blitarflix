'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlatformFilterProps {
  activePlatform: string;
  onPlatformChange: (platform: string) => void;
}

const platforms = [
  { id: 'all', name: 'All', logo: '🎬' },
  { id: 'netflix', name: 'Netflix', logo: 'N' },
  { id: 'prime', name: 'Prime', logo: '▶' },
  { id: 'disney', name: 'Disney+', logo: 'D+' },
  { id: 'hbo', name: 'HBO', logo: 'H' },
  { id: 'apple', name: 'Apple TV+', logo: '🍎' },
  { id: 'paramount', name: 'Paramount+', logo: 'P+' },
];

export function PlatformFilter({ activePlatform, onPlatformChange }: PlatformFilterProps) {
  return (
    <div className="py-4 px-4 sm:px-8 lg:px-16">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        Platform
      </h2>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {platforms.map((platform) => (
          <motion.button
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all',
              activePlatform === platform.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <span className="text-lg">{platform.logo}</span>
            <span>{platform.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
