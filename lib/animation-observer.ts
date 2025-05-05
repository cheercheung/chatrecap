'use client';

/**
 * 动画观察器工具
 * 用于在元素进入视口时执行动画
 */

/**
 * 创建动画观察器
 * @param selector 选择器
 * @param animationClass 动画类名
 * @param threshold 阈值
 * @param rootMargin 根边距
 * @param once 是否只触发一次
 */
export function createAnimationObserver(
  selector: string,
  animationClass: string,
  threshold: number = 0.1,
  rootMargin: string = '-50px',
  once: boolean = true
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return null;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          
          // 如果只需要触发一次动画，则在元素进入视口后取消观察
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove(animationClass);
        }
      });
    },
    {
      threshold,
      rootMargin
    }
  );
  
  elements.forEach((element) => {
    observer.observe(element);
  });
  
  return observer;
}

/**
 * 创建动态动画观察器
 * @param selector 选择器
 * @param callback 回调函数
 * @param threshold 阈值
 * @param rootMargin 根边距
 * @param once 是否只触发一次
 */
export function createDynamicAnimationObserver(
  selector: string,
  callback: (element: Element, isIntersecting: boolean) => void,
  threshold: number = 0.1,
  rootMargin: string = '-50px',
  once: boolean = true
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return null;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callback(entry.target, entry.isIntersecting);
        
        // 如果只需要触发一次动画，则在元素进入视口后取消观察
        if (entry.isIntersecting && once) {
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold,
      rootMargin
    }
  );
  
  elements.forEach((element) => {
    observer.observe(element);
  });
  
  return observer;
}

/**
 * 初始化页面动画
 * 自动为具有特定类名的元素添加动画
 */
export function initPageAnimations(): void {
  if (typeof window === 'undefined') return;
  
  // 淡入动画
  createAnimationObserver('.js-fade-in', 'animate-fade-in');
  
  // 从下淡入动画
  createAnimationObserver('.js-fade-in-up', 'animate-fade-in-up');
  
  // 从上淡入动画
  createAnimationObserver('.js-fade-in-down', 'animate-fade-in-down');
  
  // 从左淡入动画
  createAnimationObserver('.js-fade-in-left', 'animate-fade-in-left');
  
  // 从右淡入动画
  createAnimationObserver('.js-fade-in-right', 'animate-fade-in-right');
  
  // 缩放淡入动画
  createAnimationObserver('.js-scale-in', 'animate-scale-in');
}

/**
 * 动画观察器组件
 * 用于在组件挂载时初始化页面动画
 */
export function AnimationObserver(): null {
  if (typeof window !== 'undefined') {
    // 在组件挂载时初始化页面动画
    initPageAnimations();
  }
  
  return null;
}
