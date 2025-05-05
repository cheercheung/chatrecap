/**
 * CSS 动画工具函数
 * 用于在 JavaScript 中添加和移除 CSS 动画类
 */

/**
 * 动画类型
 */
export type AnimationType = 
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in'
  | 'pulse-subtle';

/**
 * 延迟类型
 */
export type DelayType = 
  | 'delay-100'
  | 'delay-200'
  | 'delay-300'
  | 'delay-400'
  | 'delay-500';

/**
 * 持续时间类型
 */
export type DurationType = 
  | 'duration-300'
  | 'duration-500'
  | 'duration-700'
  | 'duration-1000';

/**
 * 添加动画类
 * @param element DOM元素
 * @param animation 动画类型
 * @param delay 延迟类型
 * @param duration 持续时间类型
 * @param callback 动画结束回调函数
 */
export function addAnimation(
  element: HTMLElement,
  animation: AnimationType,
  delay?: DelayType,
  duration?: DurationType,
  callback?: () => void
): void {
  if (!element) return;

  // 添加 will-change 属性
  if (animation.includes('fade') || animation.includes('scale')) {
    element.style.willChange = 'opacity, transform';
  } else if (animation.includes('pulse')) {
    element.style.willChange = 'transform';
  }

  // 添加动画类
  element.classList.add(`animate-${animation}`);
  
  // 添加延迟类
  if (delay) {
    element.classList.add(delay);
  }
  
  // 添加持续时间类
  if (duration) {
    element.classList.add(duration);
  }
  
  // 添加填充模式类
  element.classList.add('fill-forwards');
  
  // 添加动画结束事件监听器
  if (callback) {
    const handleAnimationEnd = () => {
      callback();
      element.removeEventListener('animationend', handleAnimationEnd);
      
      // 移除 will-change 属性，释放资源
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, 100);
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
  } else {
    // 如果没有回调函数，在动画结束后移除 will-change 属性
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      
      // 移除 will-change 属性，释放资源
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, 100);
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
  }
}

/**
 * 移除动画类
 * @param element DOM元素
 * @param animation 动画类型
 * @param delay 延迟类型
 * @param duration 持续时间类型
 */
export function removeAnimation(
  element: HTMLElement,
  animation: AnimationType,
  delay?: DelayType,
  duration?: DurationType
): void {
  if (!element) return;
  
  // 移除动画类
  element.classList.remove(`animate-${animation}`);
  
  // 移除延迟类
  if (delay) {
    element.classList.remove(delay);
  }
  
  // 移除持续时间类
  if (duration) {
    element.classList.remove(duration);
  }
  
  // 移除填充模式类
  element.classList.remove('fill-forwards');
  
  // 移除 will-change 属性
  element.style.willChange = 'auto';
}

/**
 * 添加视口内动画类
 * @param element DOM元素
 * @param animation 动画类型
 * @param threshold 阈值
 * @param rootMargin 根边距
 * @param once 是否只触发一次
 * @param callback 动画结束回调函数
 * @returns IntersectionObserver 实例
 */
export function addScrollAnimation(
  element: HTMLElement,
  animation: AnimationType,
  threshold: number = 0.1,
  rootMargin: string = '-50px',
  once: boolean = true,
  callback?: () => void
): IntersectionObserver | null {
  if (!element) return null;
  
  // 添加基础类
  element.classList.add('animate-on-scroll');
  element.classList.add(animation);
  
  // 创建 IntersectionObserver
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // 添加可见类
        element.classList.add('visible');
        
        // 如果只需要触发一次动画，则在元素进入视口后取消观察
        if (once) {
          observer.unobserve(element);
        }
        
        // 调用回调函数
        if (callback) {
          callback();
        }
      } else if (!once) {
        // 移除可见类
        element.classList.remove('visible');
      }
    },
    {
      threshold,
      rootMargin
    }
  );
  
  // 开始观察
  observer.observe(element);
  
  return observer;
}

/**
 * 移除视口内动画类
 * @param element DOM元素
 * @param animation 动画类型
 * @param observer IntersectionObserver 实例
 */
export function removeScrollAnimation(
  element: HTMLElement,
  animation: AnimationType,
  observer?: IntersectionObserver
): void {
  if (!element) return;
  
  // 移除类
  element.classList.remove('animate-on-scroll');
  element.classList.remove(animation);
  element.classList.remove('visible');
  
  // 取消观察
  if (observer) {
    observer.unobserve(element);
  }
}
