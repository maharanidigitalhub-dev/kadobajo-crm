/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
      },
      {
        source: '/login',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
      },
      {
        source: '/dashboard',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/dashboard',
      },
      {
        source: '/customers',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/customers',
      },
    ];
  },
};

module.exports = nextConfig;
