/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      's3.us-west-2.amazonaws.com',
      'dl.airtable.com',
      'cdn.shopify.com',
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
