module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      process.env.TEASER_MODE === '1'
        ? {
            source: '/:any(^(?!s\/).*)',
            destination: '/',
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
};
