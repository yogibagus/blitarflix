import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Breadcrumb {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [
    { name: 'Home', href: '/' },
    ...items,
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 px-4 sm:px-8 lg:px-16 py-4">
      {allItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 ? (
            <Link href={item.href || '#'} className="hover:text-red-500 transition-colors">
              <Home className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={item.href || '#'}
              className="hover:text-red-500 transition-colors truncate max-w-[150px] sm:max-w-xs"
            >
              {item.name}
            </Link>
          )}
          {index < allItems.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-600 flex-shrink-0" />
          )}
        </div>
      ))}
    </nav>
  );
}