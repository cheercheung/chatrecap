'use client';

import dynamic from 'next/dynamic';
import { PlatformUploadProps } from './index';

// 动态加载 PlatformUpload 并禁用 SSR
const PlatformUploadClient = dynamic(
  () => import('./index'),
  { ssr: false }
);

export default function PlatformUploadWrapper(props: PlatformUploadProps) {
  return <PlatformUploadClient {...props} />;
} 