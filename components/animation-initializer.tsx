'use client';

import { useEffect } from 'react';
import { initPageAnimations } from '@/lib/animation-observer';

/**
 * 动画初始化组件
 * 用于在应用程序启动时初始化所有动画，但延迟执行以提高首屏加载性能
 */
export default function AnimationInitializer() {
  useEffect(() => {
    // 使用 requestIdleCallback 在浏览器空闲时初始化动画
    // 如果不支持 requestIdleCallback，则使用 setTimeout 延迟执行
    const initAnimations = () => {
      // 初始化页面动画
      initPageAnimations();
    };

    // 延迟初始化动画，优先处理首屏渲染
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const idleCallbackId = idleCallback(initAnimations);

    // 添加滚动事件监听器，优化滚动性能
    const handleScroll = () => {
      // 使用 requestAnimationFrame 确保动画流畅
      window.requestAnimationFrame(() => {
        // 这里可以添加滚动相关的性能优化代码
      });
    };

    // 使用 passive 选项提高滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // 清理事件监听器
      window.removeEventListener('scroll', handleScroll);

      // 清理 idle callback
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleCallbackId);
      } else {
        clearTimeout(idleCallbackId);
      }
    };
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
