/**
 * Custom image loader that bypasses Vercel's image optimization
 * for TMDB images to avoid hitting the transformation quota.
 * 
 * This loader returns the original TMDB image URL directly,
 * allowing TMDB's CDN to handle optimization.
 */
export default function imageLoader({ src, width, quality }) {
  // If it's already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // For local images or other cases, return the src with width/quality params
  const params = [];
  if (width) params.push(`w=${width}`);
  if (quality) params.push(`q=${quality}`);

  return `${src}${params.length > 0 ? '?' + params.join('&') : ''}`;
}