import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Team task management tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <nav className="bg-white border-b border-gray-200 px-8 py-4">
          <span className="text-sm font-semibold text-gray-800 tracking-wide">TaskFlow</span>
        </nav>
        {children}
      </body>
    </html>
  );
}