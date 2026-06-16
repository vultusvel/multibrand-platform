/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ['@multibrand-platform/ui'],
};

module.exports = nextConfig;
