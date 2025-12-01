import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://paopjanaxzvogcrxpdmq.supabase.co/**')],
  },
};

export default nextConfig;
