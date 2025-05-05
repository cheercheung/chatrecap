/**
 * 动画工具函数
 * 提供优化的动画配置，确保使用合成属性
 */

/**
 * 淡入动画配置
 * 使用 opacity 和 transform 属性，确保动画可以被合成
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

/**
 * 从上淡入动画配置
 * 使用 opacity 和 transform 属性，确保动画可以被合成
 */
export const fadeInUp = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  exit: { opacity: 0, transform: 'translateY(20px)' },
  transition: { duration: 0.5 }
};

/**
 * 从下淡入动画配置
 * 使用 opacity 和 transform 属性，确保动画可以被合成
 */
export const fadeInDown = {
  initial: { opacity: 0, transform: 'translateY(-20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  exit: { opacity: 0, transform: 'translateY(-20px)' },
  transition: { duration: 0.5 }
};

/**
 * 从左淡入动画配置
 * 使用 opacity 和 transform 属性，确保动画可以被合成
 */
export const fadeInLeft = {
  initial: { opacity: 0, transform: 'translateX(-20px)' },
  animate: { opacity: 1, transform: 'translateX(0)' },
  exit: { opacity: 0, transform: 'translateX(-20px)' },
  transition: { duration: 0.5 }
};

/**
 * 从右淡入动画配置
 * 使用 opacity 和 transform 属性，确保动画可以被合成
 */
export const fadeInRight = {
  initial: { opacity: 0, transform: 'translateX(20px)' },
  animate: { opacity: 1, transform: 'translateX(0)' },
  exit: { opacity: 0, transform: 'translateX(20px)' },
  transition: { duration: 0.5 }
};

/**
 * 缩放淡入动画配置
 * 使用 opacity 和 transform 属性，确保动画可以被合成
 */
export const scaleIn = {
  initial: { opacity: 0, transform: 'scale(0.9)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  exit: { opacity: 0, transform: 'scale(0.9)' },
  transition: { duration: 0.5 }
};

/**
 * 创建自定义动画配置
 * @param delay 延迟时间（秒）
 * @param duration 动画持续时间（秒）
 * @param type 动画类型
 * @returns 动画配置对象
 */
export const createAnimation = (
  delay: number = 0,
  duration: number = 0.5,
  type: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' = 'fadeIn'
) => {
  // 基础动画配置
  let animation;
  
  switch (type) {
    case 'fadeInUp':
      animation = fadeInUp;
      break;
    case 'fadeInDown':
      animation = fadeInDown;
      break;
    case 'fadeInLeft':
      animation = fadeInLeft;
      break;
    case 'fadeInRight':
      animation = fadeInRight;
      break;
    case 'scaleIn':
      animation = scaleIn;
      break;
    case 'fadeIn':
    default:
      animation = fadeIn;
      break;
  }
  
  // 返回带有自定义延迟和持续时间的动画配置
  return {
    ...animation,
    transition: {
      ...animation.transition,
      delay,
      duration
    }
  };
};

/**
 * 为视口内动画创建配置
 * @param delay 延迟时间（秒）
 * @param duration 动画持续时间（秒）
 * @param type 动画类型
 * @returns 动画配置对象，包含 whileInView 属性
 */
export const createViewportAnimation = (
  delay: number = 0,
  duration: number = 0.5,
  type: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' = 'fadeIn'
) => {
  const animation = createAnimation(delay, duration, type);
  
  return {
    initial: animation.initial,
    whileInView: animation.animate,
    exit: animation.exit,
    transition: animation.transition,
    viewport: { once: true, margin: '-50px' }
  };
};

/**
 * 添加 will-change 属性，提示浏览器进行优化
 * @param element DOM元素
 * @param properties 将要改变的属性
 */
export const addWillChange = (
  element: HTMLElement,
  properties: ('transform' | 'opacity')[] = ['transform', 'opacity']
) => {
  if (element) {
    element.style.willChange = properties.join(', ');
  }
};

/**
 * 移除 will-change 属性
 * @param element DOM元素
 */
export const removeWillChange = (element: HTMLElement) => {
  if (element) {
    element.style.willChange = 'auto';
  }
};
