import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@landing-builder/core', '@landing-builder/react'],
  webpack: (config) => {
    // Resolve workspace symlinks
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@landing-builder/core': path.resolve(__dirname, '../../packages/core/src'),
      '@landing-builder/react': path.resolve(__dirname, '../../packages/react/src'),
    };
    // Handle .tsx/.ts extensions in aliased packages
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', ...config.resolve.extensions || []];
    return config;
  },
};

export default nextConfig;
