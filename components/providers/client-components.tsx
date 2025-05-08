'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CriticalCSS from './critical-css';
import HydrationFix from './hydration-fix';

// 延迟加载非关键组件 - 修复 ChunkLoadError
// 移除 ssr: false 选项，因为在 Next.js 的新版本中，这在 Server Components 中不被支持
export const DynamicToaster = dynamic(
  () => import("@/components/ui/toaster").then(mod => mod.Toaster),
  {
    loading: () => null
  }
);

// 延迟加载分析组件 - 修复 ChunkLoadError
// 移除 ssr: false 选项，因为在 Next.js 的新版本中，这在 Server Components 中不被支持
export const DynamicAnalytics = dynamic(
  () => import("@/components/analytics"),
  {
    loading: () => null
  }
);

// 客户端包装器组件
export default function ClientComponents() {
  const [isLoaded, setIsLoaded] = useState(false);

  // 使用 useEffect 确保组件只在客户端渲染
  useEffect(() => {
    // 使用 requestIdleCallback 在浏览器空闲时设置加载状态
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const id = idleCallback(() => {
      setIsLoaded(true);
    });

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);

  return (
    <>
      {/* 修复水合错误 */}
      <HydrationFix />

      {/* 内联关键CSS */}
      <CriticalCSS />

      {/* 只在客户端加载完成后渲染非关键组件 */}
      {isLoaded && (
        <>
          <DynamicToaster />
          <DynamicAnalytics />
        </>
      )}
    </>
  );
}
