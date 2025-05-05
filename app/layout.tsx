// 这个文件只用于重定向到默认语言
// 所有的布局逻辑都在 app/[locale]/layout.tsx 中
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
