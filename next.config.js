/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      // admin.kadobajo.id/ → /admin/login (hard redirect, 308)
      {
        source: '/',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
        permanent: false,
      },
      // admin.kadobajo.id/login → /admin/login
      {
        source: '/login',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
        permanent: false,
      },
      // admin.kadobajo.id/dashboard → /admin/dashboard
      {
        source: '/dashboard',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/dashboard',
        permanent: false,
      },
      // admin.kadobajo.id/customers → /admin/customers
      {
        source: '/customers',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/customers',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
