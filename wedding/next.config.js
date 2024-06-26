module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      process.env.NEXT_PUBLIC_TEASER_MODE === '1'
        ? {
            source: '/((?!s/|robots).+)',
            destination: '/',
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
};
