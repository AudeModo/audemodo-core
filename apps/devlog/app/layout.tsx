import './global.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AudeModo · devlog',
  description: 'walking skeleton',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
