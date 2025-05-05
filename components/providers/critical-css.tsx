'use client';

// 关键CSS组件 - 内联关键样式以减少渲染阻塞
export default function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* 关键CSS - 在页面加载前立即应用 */
      body {
        background-color: hsl(340, 30%, 98%);
        color: hsl(336, 10%, 20%);
        font-family: var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        margin: 0;
        padding: 0;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }
      
      @media (prefers-color-scheme: dark) {
        body {
          background-color: hsl(336, 30%, 8%);
          color: hsl(340, 20%, 90%);
        }
      }
      
      /* 骨架屏样式 */
      .skeleton {
        background: linear-gradient(90deg, 
          rgba(255, 255, 255, 0.1), 
          rgba(255, 255, 255, 0.2), 
          rgba(255, 255, 255, 0.1)
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}} />
  );
}
