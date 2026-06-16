const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */

const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  nx: {},
  transpilePackages: ['@multibrand-platform/ui'],
};

const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
