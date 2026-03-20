import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/JsonLd';
import { generateWebSiteSchema } from '@/lib/structured-data';
import { DevToolsBlocker } from '@/components/DevToolsBlocker';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com';

export const metadata: Metadata = {
  title: {
    default: 'BlitarFlix - Watch Movies & TV Shows Online Free',
    template: '%s | BlitarFlix',
  },
  description: 'Watch the latest movies and TV shows online for free. Stream thousands of titles in HD quality. No ads, no subscription required. Start watching now!',
  keywords: 'watch movies online, free movies, stream TV shows, watch TV online, free streaming, movies HD, TV shows online, blitarflix',
  authors: [{ name: 'BlitarFlix' }],
  creator: 'BlitarFlix',
  publisher: 'BlitarFlix',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'BlitarFlix - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free. Stream thousands of titles in HD quality.',
    siteName: 'BlitarFlix',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'BlitarFlix - Watch Movies & TV Shows Online Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlitarFlix - Watch Movies & TV Shows Online Free',
    description: 'Watch the latest movies and TV shows online for free. Stream thousands of titles in HD quality.',
    images: [`${SITE_URL}/og-image.jpg`],
    creator: '@blitarflix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: 'data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAFBlkABgZZAAkJUAAHB1wABQR3AAkJCQAGBHcABQV6AAsJCQAFBIAABAOGAA0MCQAMDQwADgwJAA0NDAAODQwADA4PAA8NDAAODg8AEBEPAAsMJAAMDCQACglRAAkIBwAKCAcACwgHAAQEgQAFBIEAAwKNAA0MCgANDQ0ADwwKABAMCgAODhAAEQ8KAAkJJQAODxwACws0AAgKQwAGB1UABwZkAAYEcAAGBm0ABQN2AAYFcwAFAnwACAsIAAQDfwAJCwgABQN/AAQEggAFBIIACwwLAAMCjgANDAsABAKOAA4MCwAPDwsADhAOABAPCwAPEREACwssAAwNKQAKCjsABgdoAAYEcQAICwkAAgSDAAQDgAAJCwkACgsJAAsLCQAMDAwADgwMAAwPDAANDwwADQ4SAA8PDAAREA8ADA0qAAgIUQAJC1EABwZmAAoLCgAFA4EACwsKAAwLCgANCwoADQ4KAA4OCgAPDgoADQ8NAA4PDQAPDw0AEA8NAA0OHAAMDCgACwtAAAYEWAAJCFIABAJ2AAcFbQAICggACQoIAAoKCAAEA4IACwsLAA0NCAAMDA4ADg4LAA4PDgALDCkACwtBAAsKRwAHB1kACAkGAAkJBgAICgkACgoJAAUFgAANCgkADQ0JAA4NCQAMDgwADw0JAA0ODAAODgwADw4MABAODAAODw8ABwc/AAoLOQANDDMABgZOAAoLQgAIB1oACAhdAAYEbAAFBW8ABwZpAAgJBwAEA3sACQkHAAsJBwAKCgoACwoKAA0KCgAMDQoADQ0KAA4NCgAMDg0ADQ4NAA8NCgAODg0AEA0KAAkJIgAPDg0ADg8QAAwMKwAJCjcACww0AAkKSQAHB1IABwlYAAUDcwAEBHYACAkIAAUEdgALCQgABQR/AAUCggAFBYIACw0LAAwNCwANDQsADg0LAA0ODgAPDQsADA0UAA4RDgAQEQ4ACgsyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfJVNfV59bTYPe69LNjaulXwdfn2wSAxIHpd+mX4ROAt6r02wKWkzG6uph7J+Dq55fJOZsAkrGncyCj8oD0mVa1lYORJUpCUkXz6LiD1/SVoiS10hRGRPTrOWUEEmXH47H3uZgaqNnhM6TQKhg0tLXpp9XDxpBmNwhqNRQ0xbnICxfX2dLWU3NTUcKhR7SkuYIH6ZbgeJcYSgiyyffZl9rw2texAEQGC0fhUWA0oOrZKvk5chp1JvXU21YSesNFNXVpSubKKlL0QxA4qbVVVTR3hTNGqCAWIAcoUjkGhGaAioRpCRQmZmRmdFpqZ2djCPGGdHdUWOcwUuF3RzjHNzGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={generateWebSiteSchema()} />
      </head>
      <body className={inter.className}>
        <DevToolsBlocker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
