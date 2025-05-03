import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Chat Recap AI',
  description: 'AI-powered chat analysis and insights',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
