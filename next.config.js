/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Fixed: Restrict to specific trusted domains instead of wildcard
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
};

export default nextConfig;
