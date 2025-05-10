'use client';

import { useEffect, useState } from 'react';
import CriticalCSS from './critical-css';
import HydrationFix from './hydration-fix';
import { UserProvider } from './user-provider';
import { Toaster } from '@/components/ui/toaster';

// 客户端包装器组件
export default function ClientComponents() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ToastComponent, setToastComponent] = useState<React.ReactNode | null>(null);
  const [AnalyticsComponent, setAnalyticsComponent] = useState<React.ReactNode | null>(null);

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

  // 使用单独的 useEffect 来加载 Toaster 组件
  useEffect(() => {
    if (isLoaded) {
      // 直接使用 Toaster 组件而不是动态导入
      setToastComponent(<Toaster />);
    }
  }, [isLoaded]);

  // 使用单独的 useEffect 来加载 Analytics 组件
  useEffect(() => {
    if (isLoaded) {
      // 使用 import() 函数动态导入 Analytics 组件
      import('@/components/analytics').then((module) => {
        const AnalyticsModule = module.default;
        setAnalyticsComponent(<AnalyticsModule />);
      }).catch((error) => {
        console.error('Failed to load Analytics component:', error);
      });
    }
  }, [isLoaded]);

  return (
    <UserProvider>
      {/* 修复水合错误 */}
      <HydrationFix />

      {/* 内联关键CSS */}
      <CriticalCSS />

      {/* 只在客户端加载完成后渲染非关键组件 */}
      {ToastComponent}
      {AnalyticsComponent}
    </UserProvider>
  );
}
