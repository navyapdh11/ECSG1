/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ecsg1.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  // Required for native modules like better-sqlite3
  serverExternalPackages: ['better-sqlite3'],
  // Enable telemetry for debugging
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
