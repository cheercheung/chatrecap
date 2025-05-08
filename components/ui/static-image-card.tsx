/**
 * 静态版本的 ImageCard 组件
 * 移除客户端状态和交互，支持 SSG
 * 只显示图片，不显示标题和描述文字
 */
import Image from 'next/image';

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
  // 确保至少有一张图片
  const safeImages = images && images.length > 0 ? images : [{ src: '', alt: 'no pics' }];
  // 静态版本只显示第一张图片
  const image = safeImages[0];

  return (
    <div className={`bg-card border border-primary/10 rounded-2xl w-full overflow-hidden flex flex-col h-full ${className}`}>
      {/* 卡片区域 - 只保留图片部分 */}
      <div className="flex-grow p-4 flex flex-col justify-center relative">
        {/* 图片区域 - 完全自适应高度 */}
        <div
          className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-1"
          style={{ minHeight: '300px', height: 'auto' }}
        >
          <div className="w-full h-full relative">
            {/* 如果有真实图片，使用 Next.js Image 组件 */}
            {image.src ? (
              <div className="relative w-full h-full min-h-[300px]">
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
              <div className="text-center w-full h-full flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">📱</div>
                <div>{image.alt || 'Image placeholder'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 多图指示器 - 静态版本 */}
      {safeImages.length > 1 && (
        <div className="flex justify-center gap-1 py-3">
          {safeImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`}
              aria-label={`slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
