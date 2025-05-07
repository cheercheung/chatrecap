"use client";

export default function GlobalBg() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* 浪漫粉色渐变背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-pink-50 via-background to-background opacity-70"></div>

      {/* 装饰性花朵和心形元素 */}
      <div className="fixed top-20 left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="fixed top-40 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="fixed bottom-20 left-1/3 w-80 h-80 rounded-full bg-pink-200/10 blur-3xl"></div>
    </div>
  );
}
