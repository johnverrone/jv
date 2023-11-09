const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wnnjdgkrwtehvvxfqohk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/johnandmolly/**',
      },
    ],
  },
};

module.exports = withMDX(nextConfig);
