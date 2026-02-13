import createMiddleware from 'next-intl/middleware';
import {locales} from './i18n';

export default createMiddleware({
  locales: locales,
  defaultLocale: 'ja',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(ja|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
