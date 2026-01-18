import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/widgets/navigation';
import { Toaster } from '@/shared/ui/sonner';
import { Providers } from './providers/Providers';

export const metadata: Metadata = {
  title: 'Switchwon Exchange',
  description: 'Currency exchange application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Navigation />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
