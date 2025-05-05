'use client';

import { useEffect } from 'react';
import { initPageAnimations } from '@/lib/animation-observer';

/**
 * 动画初始化组件
 * 用于在应用程序启动时初始化所有动画
 */
export default function AnimationInitializer() {
  useEffect(() => {
    // 初始化页面动画
    initPageAnimations();
    
    // 添加滚动事件监听器，优化滚动性能
    const handleScroll = () => {
      // 使用 requestAnimationFrame 确保动画流畅
      window.requestAnimationFrame(() => {
        // 这里可以添加滚动相关的性能优化代码
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 这个组件不渲染任何内容
  return null;
}
