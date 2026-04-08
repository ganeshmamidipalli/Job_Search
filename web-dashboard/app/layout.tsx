import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: "Ganesh's Job Search Dashboard",
  description: 'AI-powered job search pipeline tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-gray-100 min-h-screen flex">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
          <footer className="border-t border-surface-light/30 mt-12 py-6 text-center text-sm text-gray-500">
            Powered by Career-Ops
          </footer>
        </main>
      </body>
    </html>
  );
}
