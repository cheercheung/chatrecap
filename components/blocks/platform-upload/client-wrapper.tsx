'use client';

import dynamic from 'next/dynamic';
import { PlatformUploadProps } from './index';

// 动态加载 PlatformUpload - 修复 ChunkLoadError
// 移除 ssr: false 选项，因为在 Next.js 的新版本中，这在 Server Components 中不被支持
const PlatformUploadClient = dynamic(
  () => import('./index'),
  { loading: () => null }
);

export default function PlatformUploadWrapper({ section, upload_box }: PlatformUploadProps) {
  // 添加数据属性，以便 CSS 选择器可以识别此组件并允许动画
  return (
    <div data-upload-component="true">
      <PlatformUploadClient
        section={section}
        upload_box={upload_box}
      />
    </div>
  );
}