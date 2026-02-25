import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Landing Builder — AI-Powered Landing Pages',
  description: 'Describe what you need. AI designs and builds your landing page. Edit visually. Export anywhere.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
