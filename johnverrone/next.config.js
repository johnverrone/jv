/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/music',
        destination: 'http://top-tracks-2021.vercel.app/',
        permanent: true,
        basePath: false,
      },
    ];
  },
};
