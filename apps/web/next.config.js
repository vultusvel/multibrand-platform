/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: true,
    cacheComponents: true,
  },
  transpilePackages: ['@multibrand-platform/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'downloads.ctfassets.net',
      },
    ],
  },
};

module.exports = nextConfig;
