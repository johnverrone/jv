/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wnnjdgkrwtehvvxfqohk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/portfolio/**',
      },
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
        port: '',
        pathname: '/.attachments/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/music',
        destination: 'http://jv-top-tracks.vercel.app/',
        permanent: true,
        basePath: false,
      },
    ];
  },
};
