import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Foresight 360 — Gilead Sciences',
  description: 'Event-Driven Forecasting Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
