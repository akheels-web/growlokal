import type { ReactNode } from 'react';

export const metadata = {
  title: 'GrowLokal — Grow your coaching center on Google & WhatsApp',
  description: 'AI marketing for South Indian coaching & tuition centers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, color: '#111' }}>
        {children}
      </body>
    </html>
  );
}
