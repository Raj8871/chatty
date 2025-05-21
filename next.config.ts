import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jpebdhlnersbspkpezmk.supabase.co', // Added for Supabase storage
        port: '',
        pathname: '/**', // Allows images from any path on this Supabase storage hostname
      },
    ],
  },
};

export default nextConfig;
