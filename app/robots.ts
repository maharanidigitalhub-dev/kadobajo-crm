import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://kadobajo.id/sitemap.xml',
    host: 'https://kadobajo.id',
  };
}
