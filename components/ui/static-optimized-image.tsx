/**
 * 静态版本的 OptimizedImage 组件
 * 移除客户端状态和交互，支持 SSG
 */
import Image from 'next/image';

interface StaticOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function StaticOptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  objectFit = 'cover'
}: StaticOptimizedImageProps) {
  // 检查是否是外部图片
  const isExternal = src.startsWith('http') || src.startsWith('https');
  
  // 设置占位图
  const imgSrc = src || '/imgs/placeholder.png';

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
        />
      )}
    </div>
  );
}
