/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.vidking.net https://vidking.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' blob: data: https:",
              "frame-src 'self' https://www.vidking.net https://vidking.net https://www.youtube.com https://youtube.com https://*.youtube.com",
              "frame-ancestors 'self'",
              "connect-src 'self' https: wss:",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: [
              'geolocation=()',
              'microphone=()',
              'camera=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
            ].join(', '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
