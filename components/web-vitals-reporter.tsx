'use client';

import { useEffect } from 'react';
import { initWebVitals, logWebVitals } from '@/lib/web-vitals';

/**
 * Web Vitals 监控组件
 * 用于在客户端初始化 Web Vitals 监控
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // 初始化 Web Vitals 监控
    initWebVitals(logWebVitals);
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
