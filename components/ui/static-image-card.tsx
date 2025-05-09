'use client';

/**
 * 静态版本的 ImageCard 组件
 * 添加左右点击按钮，保持4:3图片比例
 * 只显示图片，不显示标题和描述文字
 */
import Image from 'next/image';
import { useState } from 'react';

interface StaticImageCardProps {
  images: {
    src: string;
    alt: string;
  }[];
  className?: string;
}

export default function StaticImageCard({
  images,
  className = ''
}: StaticImageCardProps) {
  // 添加状态管理当前显示的图片索引
  const [currentIndex, setCurrentIndex] = useState(0);

  // 确保至少有一张图片
  const safeImages = images && images.length > 0 ? images : [{ src: '', alt: 'no pics' }];

  // 处理前一张图片
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? safeImages.length - 1 : prevIndex - 1
    );
  };

  // 处理下一张图片
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === safeImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 当前显示的图片
  const image = safeImages[currentIndex];

  return (
    <div className={`bg-card border border-primary/10 rounded-2xl w-full overflow-hidden flex flex-col h-full ${className}`}>
      {/* 卡片区域 - 只保留图片部分 */}
      <div className="p-4 flex flex-col justify-center relative">
        {/* 图片区域 - 4:3比例 */}
        <div
          className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
          style={{ aspectRatio: '4/3' }}
        >
          <div className="w-full h-full relative">
            {/* 如果有真实图片，使用 Next.js Image 组件 */}
            {image.src ? (
              <div className="relative w-full h-full" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={image.src}
                  alt={image.alt || 'Chat analysis image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg"
                  loading="eager"
                  priority={true}
                />
              </div>
            ) : (
              // 否则显示占位符
              <div className="text-center w-full h-full flex flex-col items-center justify-center" style={{ aspectRatio: '4/3' }}>
                <div className="text-3xl mb-2">📱</div>
                <div>{image.alt || 'Image placeholder'}</div>
              </div>
            )}
          </div>
        </div>

        {/* 左右切换按钮 - 只有多张图片时才显示 */}
        {safeImages.length > 1 && (
          <div className="absolute left-0 top-1/3 w-full flex justify-between px-2 pointer-events-none">
            <button
              onClick={handlePrev}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md pointer-events-auto"
              aria-label="previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md pointer-events-auto"
              aria-label="next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 多图指示器 - 可点击版本 */}
      {safeImages.length > 1 && (
        <div className="flex justify-center gap-1 py-3">
          {safeImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex(index)}
              style={{ cursor: 'pointer' }}
              aria-label={`slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
