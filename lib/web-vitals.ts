import { ReportCallback, getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

/**
 * 初始化 Web Vitals 监控
 * @param onPerfEntry 性能指标回调函数
 */
export function initWebVitals(onPerfEntry?: ReportCallback): void {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // 测量 CLS (Cumulative Layout Shift)
    getCLS(onPerfEntry);
    // 测量 FCP (First Contentful Paint)
    getFCP(onPerfEntry);
    // 测量 FID (First Input Delay)
    getFID(onPerfEntry);
    // 测量 LCP (Largest Contentful Paint)
    getLCP(onPerfEntry);
    // 测量 TTFB (Time to First Byte)
    getTTFB(onPerfEntry);
  }
}

/**
 * 记录 Web Vitals 指标
 * @param metric 性能指标
 */
export function logWebVitals(metric: any): void {
  // 在开发环境中打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vitals: ${metric.name} = ${Math.round(metric.value * 100) / 100}`);
  }

  // 在生产环境中可以发送到分析服务
  if (process.env.NODE_ENV === 'production') {
    // 这里可以添加发送到分析服务的代码
    // 例如 Google Analytics、自定义后端 API 等
    const body = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      startTime: metric.startTime,
      label: metric.label,
      delta: metric.delta,
    };

    // 示例：发送到自定义 API
    // fetch('/api/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // }).catch((error) => {
    //   console.error('Failed to send web vitals:', error);
    // });
  }
}
