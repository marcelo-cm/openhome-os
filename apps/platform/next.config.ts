import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'vwnovzmnpfpvkaycnwvt.supabase.co',
        pathname: '/storage/v1/object/public/**',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
