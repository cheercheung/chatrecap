'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { LandingPage } from '@/types/pages/landing';

// 静态导入关键组件（首屏显示的组件）
import OptimizedHero from "@/components/blocks/hero/optimized";

// 动态导入非关键组件（延迟加载），添加 ssr: false 选项减少服务器端渲染负担
const CTA = dynamic(() => import('@/components/blocks/cta'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const FAQ = dynamic(() => import('@/components/blocks/faq'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const Feature = dynamic(() => import('@/components/blocks/feature'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const GridGallery = dynamic(() => import('@/components/blocks/grid-gallery'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const QuoteCards = dynamic(() => import('@/components/blocks/quote-cards'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const PlatformUpload = dynamic(() => import('@/components/blocks/platform-upload'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const SimplePricing = dynamic(() => import('@/components/blocks/simple-pricing'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const Stats = dynamic(() => import('@/components/blocks/stats'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

const Testimonial = dynamic(() => import('@/components/blocks/testimonial'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>,
  ssr: false
});

export default function LandingSections({ page }: { page: LandingPage }) {
  // 使用状态管理组件加载
  const [loadSecondary, setLoadSecondary] = useState(false);
  const [loadTertiary, setLoadTertiary] = useState(false);

  useEffect(() => {
    // 使用简单的 setTimeout 替代 requestIdleCallback
    // 增加延迟时间，减轻主线程负担

    // 延迟加载次要组件
    const secondaryTimeout = setTimeout(() => {
      setLoadSecondary(true);
    }, 3000); // 增加到3秒

    // 进一步延迟加载第三级组件
    const tertiaryTimeout = setTimeout(() => {
      setLoadTertiary(true);
    }, 6000); // 增加到6秒

    return () => {
      clearTimeout(secondaryTimeout);
      clearTimeout(tertiaryTimeout);
    };
  }, []);

  return (
    <>
      {/* 英雄区块 - 关键组件，立即加载 */}
      {page.hero && <OptimizedHero hero={page.hero} />}

      {/* 次要组件，在首屏内容加载完成后加载 */}
      {loadSecondary && (
        <>
          {/* 平台上传组件 - 次要优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30"></div>}>
            {page.platform_upload && page.upload_box && (
              <PlatformUpload section={page.platform_upload} upload_box={page.upload_box} />
            )}
          </Suspense>

          {/* 特性组件 - 次要优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30"></div>}>
            {page.feature && <Feature section={page.feature} />}
          </Suspense>
        </>
      )}

      {/* 第三级组件，在次要组件加载完成后加载 */}
      {loadTertiary && (
        <>
          {/* 定价组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30"></div>}>
            {page.simple_pricing && <SimplePricing {...page.simple_pricing} />}
          </Suspense>

          {/* FAQ组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30"></div>}>
            {page.faq && <FAQ section={page.faq} />}
          </Suspense>

          {/* CTA组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30"></div>}>
            {page.cta && <CTA section={page.cta} />}
          </Suspense>
        </>
      )}
    </>
  );
}
