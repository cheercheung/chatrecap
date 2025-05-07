'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ImageCardProps {
  images: {
    src: string;
    alt: string;
  }[];
  title?: string;
  description?: string;
  className?: string;
  translationNamespace?: string;
  maxImages?: number; // 控制最大显示图片数量
}

export default function ImageCard({
  images,
  title,
  description,
  className = '',
  translationNamespace = 'image'
}: ImageCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 尝试使用 next-intl 的翻译功能
  let t;
  try {
    t = useTranslations(translationNamespace);
  } catch (error) {
    // 如果无法获取翻译，使用空函数
    t = (key: string) => key;
  }

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

  return (
    <div className={`bg-card border border-primary/10 rounded-2xl w-full overflow-hidden flex flex-col h-full ${className}`}>
      {/* 卡片区域 */}
      <div className="flex-grow p-4 flex flex-col justify-between relative">
        {/* 图片区域 - 自适应高度 */}
        <div
          className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-6"
          style={{ height: 'calc(100% - 120px)', minHeight: '200px' }}
        >
          <div className="w-full h-full relative">
            {/* 如果有真实图片，显示图片 */}
            {safeImages[currentIndex].src ? (
              <img
                src={safeImages[currentIndex].src}
                alt={safeImages[currentIndex].alt || t('alt') || '图片'}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              // 否则显示占位符
              <div className="text-center w-full h-full flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">📱</div>
                <div>{safeImages[currentIndex].alt || t('alt') || '图片占位符'}</div>
              </div>
            )}
          </div>
        </div>

        {/* 卡片内容 */}
        <div>
          <h4 className="font-medium text-lg mb-3 text-primary">
            {title || t('title') || '聊天分析示例'}
          </h4>
          <p className="text-muted-foreground">
            {description || t('description') || '上传您的聊天记录，获取深入的关系洞察和沟通模式分析。'}
          </p>
        </div>

        {/* 左右切换按钮 - 只有多张图片时才显示 */}
        {safeImages.length > 1 && (
          <div className="absolute left-0 top-1/3 w-full flex justify-between px-2 pointer-events-none">
            <button
              onClick={handlePrev}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md pointer-events-auto"
              aria-label={t('previous') || 'previous'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md pointer-events-auto"
              aria-label={t('next') || 'next'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 底部指示器 - 只有多张图片时才显示 */}
      {safeImages.length > 1 && (
        <div className="flex justify-center gap-1 py-3">
          {safeImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex(index)}
              style={{ cursor: 'pointer' }}
              aria-label={`${t('slide') || '幻灯片'} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
