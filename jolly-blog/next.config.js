module.exports = {
  async redirects() {
    return [
      process.env.MAINTENANCE_MODE === '1'
        ? {
            source: '/((?!maintenance).*)',
            destination: '/maintenance.html',
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
};
