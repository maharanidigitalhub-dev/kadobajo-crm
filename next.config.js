/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [
        // admin.kadobajo.id/* → serve /admin/* pages transparently
        // URL stays as admin.kadobajo.id but serves the /admin route
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'admin.kadobajo.id' }],
          destination: '/admin/:path*',
        },
        // admin.kadobajo.id/ → /admin/login (root)
        {
          source: '/',
          has: [{ type: 'host', value: 'admin.kadobajo.id' }],
          destination: '/admin/login',
        },
      ],
    };
  },
};

module.exports = nextConfig;
