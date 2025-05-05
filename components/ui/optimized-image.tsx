'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

// 为图片创建模糊占位符 - 移到组件外部避免重复创建
const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQviwAAAABJRU5ErkJggg==';

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority); // 如果是优先加载的图片，初始状态设为已加载
  const [imgSrc, setImgSrc] = useState(src);

  // 使用 useMemo 计算是否是外部图片，避免不必要的重新计算
  const isExternal = useMemo(() => {
    return src.startsWith('http') || src.startsWith('https');
  }, [src]);

  // 只在src变化时更新imgSrc
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // 处理图片加载完成
  const handleImageLoad = () => {
    if (isLoading) {
      setIsLoading(false);
    }
  };

  // 处理图片加载错误
  const handleImageError = () => {
    setIsLoading(false);
    setImgSrc('/imgs/placeholder.png'); // 加载失败时显示占位图
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      {isExternal ? (
        // 外部图片使用普通 img 标签，但添加懒加载和占位符
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'} // 添加解码属性以优化渲染
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        // 内部图片使用 Next.js Image 组件
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={handleImageLoad}
          onError={handleImageError}
          unoptimized={isExternal} // 对于外部图片，禁用Next.js的优化以避免额外的处理
        />
      )}

      {/* 加载中的占位符 - 只在非优先加载的图片上显示 */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
