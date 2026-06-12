const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */

const nextConfig = {
  nx: {},
  // Transpile workspace libraries that ship raw TS/TSX (via package.json exports)
  transpilePackages: ['@multibrand-platform/ui'],
};

const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
