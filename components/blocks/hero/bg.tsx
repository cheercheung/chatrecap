/**
 * 静态 Hero 背景组件
 * 移除了所有动画，转换为服务器组件以支持 SSG
 */
export default function HeroBg() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden">
      {/* 浪漫粉色渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-background to-background opacity-70"></div>

      {/* 装饰性花朵和心形元素 - 静态版本 */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-pink-200/10 blur-3xl"></div>

      {/* 静态心形元素 - 移除动画类 */}
      <svg
        className="absolute top-1/4 left-1/4 opacity-20"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(236, 72, 153, 0.7)" />
      </svg>

      <svg
        className="absolute top-1/3 right-1/4 opacity-20"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(236, 72, 153, 0.5)" />
      </svg>

      <svg
        className="absolute bottom-1/4 right-1/3 opacity-20"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(236, 72, 153, 0.6)" />
      </svg>
    </div>
  );
}
