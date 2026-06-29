import './global.css';

import type { Metadata } from 'next';

/** 모든 페이지에 공통으로 들어가는 기본 메타데이터. */
export const metadata: Metadata = {
  title: 'AudeModo · devlog',
  description: 'walking skeleton',
};

/**
 * 앱 전체를 감싸는 루트 레이아웃.
 * `<html>`, `<body>`를 한 번만 정의하고, 각 페이지를 `children`으로 받는다.
 *
 * @param children - 현재 라우트가 렌더하는 내용
 */
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
