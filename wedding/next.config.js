module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      process.env.TEASER_MODE === '1'
        ? {
            source: '/((?!s/).+)',
            destination: '/',
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
};
