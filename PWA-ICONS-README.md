# PWA Icons Required

To enable the "Install BlitarFlix" button in Chrome, you need to upload the following icon files to the `public/` folder:

## Required Icons

Place these PNG files in the `public/` directory:

1. `icon-72x72.png` - 72x72 pixels
2. `icon-96x96.png` - 96x96 pixels
3. `icon-128x128.png` - 128x128 pixels
4. `icon-144x144.png` - 144x144 pixels
5. `icon-152x152.png` - 152x152 pixels
6. `icon-192x192.png` - 192x192 pixels (also used for Apple Touch Icon)
7. `icon-384x384.png` - 384x384 pixels
8. `icon-512x512.png` - 512x512 pixels (maskable - should have safe padding)

## Design Tips

- Use your BlitarFlix logo
- Dark background (black or dark blue) works best
- Make the logo centered and readable at small sizes
- For maskable icons (192x192 and 512x512), keep important content away from edges
- Use PNG format with transparency or solid background

## How to Generate Icons

You can use online tools to generate all sizes from one source image:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## After Uploading Icons

1. Make sure all 8 icon files are in the `public/` folder
2. Restart your dev server: `npm run dev`
3. Open the site in Chrome and look for the install icon in the address bar
4. Click it to test the installation

## Testing

To test PWA installability before uploading real icons, you can:
1. Use Chrome DevTools (F12) → Application tab
2. Check "Manifest" section for any errors
3. Look for "Installability" section to see if your app meets criteria