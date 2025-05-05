'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'scale-in';
  delay?: 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 'delay-500';
  duration?: 'duration-300' | 'duration-500' | 'duration-700' | 'duration-1000';
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * CSS 动画观察器组件
 * 使用 IntersectionObserver API 和 CSS 动画类，在元素进入视口时添加动画
 * 比 Framer Motion 更轻量，性能更好
 */
export default function AnimateOnScroll({
  children,
  animation,
  delay,
  duration,
  className = '',
  threshold = 0.1,
  rootMargin = '-50px',
  once = true
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // 如果只需要触发一次动画，则在元素进入视口后取消观察
          if (once) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        'animate-on-scroll',
        animation,
        delay,
        duration,
        isVisible && 'visible',
        className
      )}
    >
      {children}
    </div>
  );
}
