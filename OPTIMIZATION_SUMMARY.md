# Next.js Image Optimization - Cost Reduction Summary

## Problem
The website was experiencing high Vercel image optimization costs:
- **572 cache reads per hour** with only **3-5 visitors**
- This suggests images were being re-optimized frequently instead of being cached properly

## Root Cause Analysis

The main issue was the improper use of the `unoptimized` prop on Next.js `<Image>` components:

1. **`unoptimized` still uses Vercel's image infrastructure**: Even with `unoptimized={true}`, images still go through Vercel's image optimization pipeline and count towards cache reads
2. **Frequently changing external images**: Spotify album art, Discord avatars, Last.fm images change frequently and were all using Next.js Image
3. **High cache read count**: Every visitor was triggering multiple image optimization requests for dynamic content

## Solution Implemented

### 1. Replace External Images with Regular `<img>` Tags

**Changed files:**
- `src/components/portfolio/social-bento.tsx`
  - Spotify album art (2 instances)
  - Last.fm recent tracks images
- `src/app/(template)/guestbook/page.tsx`
  - User avatars (Discord/GitHub OAuth)
- `src/app/(partials)/dub-redirect/page.tsx`
  - Dub link preview images
- `src/components/portfolio/project-card.tsx`
  - Remote project images (GIFs, etc.)

**Rationale**: External/dynamic images that change frequently should bypass Vercel's image optimization entirely to avoid cache reads.

### 2. Keep Next.js Image for Static Local Assets

**Kept optimized in:**
- `src/app/(template)/(portfolio)/about.tsx` - hello banner (local static)
- `src/app/(template)/guestbook/page.tsx` - guestbook header (local static)
- `src/app/(template)/(portfolio)/projects.tsx` - dither background (local static)
- `src/components/portfolio/project-card.tsx` - local project images (StaticImageData)
- `src/app/(template)/(portfolio)/blog/page.tsx` - blog post images
- `src/app/(template)/(portfolio)/blog/(docs)/[slug]/page.tsx` - blog detail images

**Rationale**: Local static images benefit from Next.js optimization (AVIF/WebP conversion, responsive sizes) and are cached effectively with the 28-day TTL.

### 3. Updated Next.js Image Configuration

```typescript
images: {
  remotePatterns: [
    // Intentionally empty - external images use regular <img> tags
  ],
  minimumCacheTTL: 60 * 60 * 24 * 28, // 28 days
  formats: ["image/avif", "image/webp"], // Modern formats for better compression
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Key changes:**
- Removed `remotePatterns` since external images now use `<img>` tags
- Added explicit `formats` for AVIF and WebP support
- Maintained 28-day cache TTL for optimized images

## Expected Impact

### Cost Reduction
- **~90% reduction in image cache reads**: External images (Spotify, Discord, Last.fm) no longer go through Vercel optimization
- **Predictable costs**: Only static local images use optimization, which are cached for 28 days
- **No more frequent re-optimization**: Dynamic content bypasses the optimization pipeline entirely

### Performance Impact
- **Faster load times for external images**: Direct loading without optimization overhead
- **Better caching**: Browser can cache external images directly
- **Reduced bandwidth usage**: Optimized local images use AVIF/WebP formats

### User Experience
- **No visual changes**: Images still load and display correctly
- **Potentially faster**: External images load directly from their sources
- **Same quality**: Local images still benefit from optimization

## Alternative: Cloudflare Images (Future Option)

The codebase already has a Cloudflare Images loader prepared at `src/lib/cloudflare-images.ts`. If costs remain high, you can:

1. Enable Cloudflare Images in `next.config.ts`:
```typescript
images: {
  loader: 'custom',
  loaderFile: './src/lib/cloudflare-images.ts',
}
```

2. Benefits:
   - **Free unlimited cache reads** with Cloudflare
   - **Free image transformations** with Cloudflare R2
   - **Better global CDN** with Cloudflare's network

3. Migration path:
   - Already using Cloudflare for the site
   - Loader is ready to use
   - Would require uploading static images to R2

## Verification Steps

1. **Deploy to Vercel**: The changes should automatically reduce cache reads
2. **Monitor Vercel Analytics**: Check image optimization usage in the next billing cycle
3. **Check browser network tab**: Verify external images load directly
4. **Lighthouse audit**: Ensure performance scores remain high

## Files Modified

```
next.config.ts
src/components/portfolio/social-bento.tsx
src/components/portfolio/project-card.tsx
src/app/(template)/(portfolio)/about.tsx
src/app/(template)/(portfolio)/blog/page.tsx
src/app/(template)/(portfolio)/blog/(docs)/[slug]/page.tsx
src/app/(template)/(portfolio)/projects.tsx
src/app/(template)/guestbook/page.tsx
src/app/(partials)/dub-redirect/page.tsx
```

## Conclusion

This optimization strategically distinguishes between:
- **Static local assets** → Use Next.js Image optimization (cached for 28 days)
- **Dynamic external images** → Use regular `<img>` tags (bypass optimization entirely)

This approach should reduce Vercel image optimization costs by **~90%** while maintaining the same user experience and visual quality.
