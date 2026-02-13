/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable experimental features if needed
  },
}

const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
);

module.exports = withNextIntl(nextConfig)
