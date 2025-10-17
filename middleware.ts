// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/about',
    '/contact',
    '/api/books',
    '/api/events',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/cart',
  ],
  ignoredRoutes: [
    '/api/webhooks/clerk' // If you have webhooks
  ]
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};