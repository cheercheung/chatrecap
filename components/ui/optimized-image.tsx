'use client';

import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    // 检查是否是外部图片链接
    const isExternalUrl = src.startsWith('http') || src.startsWith('https');
    setIsExternal(isExternalUrl);
    setImgSrc(src);
  }, [src]);

  // 为外部图片创建模糊占位符
  const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQviwAAAABJRU5ErkJggg==';

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      {isExternal ? (
        // 外部图片使用普通 img 标签，但添加懒加载和占位符
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImgSrc('/imgs/placeholder.png'); // 加载失败时显示占位图
          }}
        />
      ) : (
        // 内部图片使用 Next.js Image 组件
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImgSrc('/imgs/placeholder.png'); // 加载失败时显示占位图
          }}
        />
      )}
      
      {/* 加载中的占位符 */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
