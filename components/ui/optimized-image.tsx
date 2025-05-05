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
        // 外部图片使用普通 img 标签，添加懒加载
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full"
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
          style={{ objectFit }}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          unoptimized={isExternal} // 对于外部图片，禁用Next.js的优化以避免额外的处理
        />
      )}

      {/* 移除加载动画占位符 */}
    </div>
  );
}
