import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Sidebar';

export const metadata: Metadata = {
  title: "Ganesh's Job Search Dashboard",
  description: 'AI-powered job search pipeline tracker',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Job Search',
  },
};

export const viewport: Viewport = {
  themeColor: '#06b6d4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-background text-gray-100 min-h-screen flex">
        <Navigation />
        <main className="flex-1 md:ml-64 min-h-screen pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
          <footer className="border-t border-surface-light/30 mt-12 py-6 text-center text-sm text-gray-500 hidden md:block">
            Powered by Career-Ops
          </footer>
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}`,
          }}
        />
      </body>
    </html>
  );
}
