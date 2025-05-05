'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { createViewportAnimation } from '@/lib/animation';

interface ViewportAnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  type?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * 视口动画组件
 * 只有当元素进入视口时才会触发动画
 * 使用 IntersectionObserver API 优化性能
 */
export default function ViewportAnimation({
  children,
  delay = 0,
  duration = 0.5,
  type = 'fadeInUp',
  className = '',
  threshold = 0.1,
  rootMargin = '-50px',
  once = true
}: ViewportAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // 添加 will-change 属性，提示浏览器进行优化
    if (type.includes('fade')) {
      currentRef.style.willChange = 'opacity, transform';
    } else if (type.includes('scale')) {
      currentRef.style.willChange = 'opacity, transform';
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // 如果只需要触发一次动画，则在元素进入视口后取消观察
          if (once) {
            observer.unobserve(currentRef);
            
            // 动画完成后移除 will-change 属性，释放资源
            setTimeout(() => {
              if (currentRef) {
                currentRef.style.willChange = 'auto';
              }
            }, (delay + duration) * 1000 + 100);
          }
        } else if (!once) {
          setIsInView(false);
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
  }, [delay, duration, once, rootMargin, threshold, type]);

  // 获取动画配置
  const animation = createViewportAnimation(delay, duration, type);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={animation.initial}
      animate={isInView ? animation.whileInView : animation.initial}
      exit={animation.exit}
      transition={animation.transition}
    >
      {children}
    </motion.div>
  );
}
