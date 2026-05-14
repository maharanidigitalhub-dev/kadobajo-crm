/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
        permanent: false,
      },
      {
        source: '/login',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/login',
        permanent: false,
      },
      {
        source: '/dashboard',
        has: [{ type: 'host', value: 'admin.kadobajo.id' }],
        destination: '/admin/dashboard',
        permanent: false,
      },
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
