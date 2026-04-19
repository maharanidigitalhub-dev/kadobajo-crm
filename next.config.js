/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // When accessed via admin.kadobajo.id, rewrite / to /admin/login
      {
        source: '/',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
      },
      // Rewrite all admin.kadobajo.id paths to /admin/:path*
      {
        source: '/:path((?!admin).*)',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/:path',
      },
    ];
  },
};

module.exports = nextConfig;
