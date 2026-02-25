import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landing Builder Demo',
  description: 'AI-powered landing page builder SDK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
