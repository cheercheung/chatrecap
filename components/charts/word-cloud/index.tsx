"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface WordItem {
  word: string;
  count: number;
}

interface WordCloudProps {
  words: WordItem[];
  excludeWordFn?: (word: string) => boolean;
  maxWords?: number;
  className?: string;
  colorMode?: 'opacity' | 'gradient';
  minFontSize?: number;
  maxFontSize?: number;
  useRandomRotation?: boolean;
}

/**
 * 词云图组件 - 自适应容器大小
 */
const WordCloud: React.FC<WordCloudProps> = ({
  words,
  excludeWordFn,
  maxWords = 50,
  className,
  colorMode = 'opacity',
  minFontSize = 0.6,
  maxFontSize = 2.2,
  useRandomRotation = false,
}) => {
  // 获取翻译
  const t = useTranslations('chatrecapresult');

  // 创建容器引用和缩放状态
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 过滤并限制词云显示数量
  const filteredWords = excludeWordFn
    ? words.filter(wordData => !excludeWordFn(wordData.word)).slice(0, maxWords)
    : words.slice(0, maxWords);

  // 如果没有有效的词，显示提示信息
  if (filteredWords.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{t('no_meaningful_words')}</div>;
  }

  const maxCount = filteredWords[0]?.count || 1;

  // 根据容器大小调整词云大小 - 使用防抖优化性能
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateScale = () => {
      if (containerRef.current && cloudRef.current) {
        // 获取容器和词云的尺寸
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const cloudWidth = cloudRef.current.scrollWidth;
        const cloudHeight = cloudRef.current.scrollHeight;

        // 设置容器大小状态
        setContainerSize({
          width: containerWidth,
          height: containerHeight
        });

        // 计算缩放比例，确保词云完全适应容器
        // 减去一些边距以确保有足够的空间
        const widthScale = (containerWidth - 20) / cloudWidth;
        const heightScale = (containerHeight - 20) / cloudHeight;

        // 使用较小的缩放比例，确保在两个维度上都适应
        const newScale = Math.min(widthScale, heightScale, 1);

        // 只有当词云超出容器或缩放比例变化较大时才更新
        if (cloudWidth > containerWidth || cloudHeight > containerHeight || Math.abs(newScale - scale) > 0.05) {
          setScale(Math.max(newScale, 0.5)); // 设置最小缩放比例为0.5
        }
      }
    };

    // 使用防抖函数优化性能
    const debouncedUpdateScale = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScale, 100);
    };

    // 初始化时更新一次
    updateScale();

    // 添加窗口大小变化监听器，使用防抖函数
    window.addEventListener('resize', debouncedUpdateScale);

    // 清理函数
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdateScale);
    };
  }, [filteredWords, scale]);

  // 动态调整字体大小的基础值
  const baseFontSizeAdjustment = Math.min(
    1,
    Math.max(0.5, Math.sqrt(containerSize.width * containerSize.height) / 500)
  );

  // 调整后的字体大小范围
  const adjustedMinFontSize = minFontSize * baseFontSizeAdjustment;
  const adjustedMaxFontSize = maxFontSize * baseFontSizeAdjustment;

  return (
    <div ref={containerRef} className={`${className} relative overflow-hidden`}>
      <div
        ref={cloudRef}
        className="flex flex-wrap gap-1 justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          width: 'auto',
          height: 'auto',
          maxWidth: '200%', // 允许初始超出以便正确计算缩放
          maxHeight: '200%'
        }}
      >
        {filteredWords.map((word, index) => {
          // 使用对数比例调整字体大小，确保区分度更明显
          const fontSize = adjustedMinFontSize +
            ((Math.log(word.count) / Math.log(maxCount)) * (adjustedMaxFontSize - adjustedMinFontSize));

          // 旋转角度设置 - 减小旋转角度以使词云更紧凑
          let rotation;
          if (useRandomRotation) {
            rotation = Math.floor(Math.random() * 10) - 5; // 减小随机旋转范围
          } else {
            rotation = (index % 5) * 2 - 4; // 减小固定旋转范围
          }

          // 计算不透明度
          const opacity = colorMode === 'opacity'
            ? 0.7 + Math.min(0.3, word.count / maxCount * 0.3)
            : 1;

          // 计算颜色
          const color = colorMode === 'gradient'
            ? `hsl(var(--primary))`
            : undefined;

          return (
            <div
              key={index}
              className="px-1 py-0.5 transition-all duration-300 hover:scale-110 whitespace-nowrap"
              style={{
                fontSize: `${fontSize}rem`,
                fontWeight: index < 5 ? 700 : index < 10 ? 600 : 500,
                transform: `rotate(${rotation}deg)`,
                opacity,
                color
              }}
            >
              {word.word}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordCloud;
