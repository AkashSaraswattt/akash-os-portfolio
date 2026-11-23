import type { NextConfig } from 'next';
const config: NextConfig = {
  turbopack: { root: __dirname },
  devIndicators: false,
  output: 'export',
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: true,
};
export default config;
