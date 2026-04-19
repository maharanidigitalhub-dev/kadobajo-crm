/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // admin.kadobajo.id/ → /admin/login
      {
        source: '/',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
      },
      // admin.kadobajo.id/login → /admin/login
      {
        source: '/login',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
      },
      // admin.kadobajo.id/dashboard → /admin/dashboard
      {
        source: '/dashboard',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/dashboard',
      },
      // admin.kadobajo.id/customers → /admin/customers
      {
        source: '/customers',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/customers',
      },
    ];
  },

  async redirects() {
    return [
      // admin.kadobajo.id/ → /login (hard redirect for root)
      {
        source: '/',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
