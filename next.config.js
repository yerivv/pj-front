/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: async () => {
    return [
      {
        source: '/:path*',
        destination: 'http://localhost:3002/:path*',
      },
    ]
  }
}

module.exports = nextConfig
