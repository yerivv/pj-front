/** @type {import('next').NextConfig} */

const withSitemap = require('next-sitemap');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/:path*',
      },
    ]
  },
  ...withSitemap({
    siteUrl: 'https://example.com',
    generateRobotsTxt: true,
  }),
}

module.exports = nextConfig
