module.exports = {
  async redirects() {
    return [
      process.env.MAINTENANCE_MODE === '1'
        ? {
            source: '/((?!maintenance).*)',
            destination: '/maintenance',
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
};
