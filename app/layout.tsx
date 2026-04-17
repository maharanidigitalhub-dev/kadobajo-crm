import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kado Bajo – Souvenir Labuan Bajo',
  description: 'Oleh-oleh khas Labuan Bajo. Souvenir premium, harga terjangkau.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
