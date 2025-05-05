'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { LandingPage } from '@/types/pages/landing';

// 静态导入关键组件（首屏显示的组件）
import OptimizedHero from "@/components/blocks/hero/optimized";
import NotificationBlockWrapper from "@/components/blocks/notification-block/client-wrapper";

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
    // 使用 requestIdleCallback 在浏览器空闲时加载次要组件
    const loadSecondaryComponents = () => {
      setLoadSecondary(true);
    };

    // 使用 requestIdleCallback 在浏览器空闲时加载第三级组件
    const loadTertiaryComponents = () => {
      setLoadTertiary(true);
    };

    // 优先加载首屏内容，然后在浏览器空闲时加载其他内容
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));

    // 延迟加载次要组件
    const secondaryTimeout = setTimeout(() => {
      idleCallback(loadSecondaryComponents);
    }, 1000);

    // 进一步延迟加载第三级组件
    const tertiaryTimeout = setTimeout(() => {
      idleCallback(loadTertiaryComponents);
    }, 2000);

    return () => {
      clearTimeout(secondaryTimeout);
      clearTimeout(tertiaryTimeout);
    };
  }, []);

  return (
    <>
      {/* 添加通知区块 - 关键组件，立即加载 */}
      <NotificationBlockWrapper />

      {/* 英雄区块 - 关键组件，立即加载 */}
      {page.hero && <OptimizedHero hero={page.hero} />}

      {/* 次要组件，在首屏内容加载完成后加载 */}
      {loadSecondary && (
        <>
          {/* 平台上传组件 - 次要优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.platform_upload && page.upload_box && (
              <PlatformUpload section={page.platform_upload} upload_box={page.upload_box} />
            )}
          </Suspense>

          {/* 介绍组件 - 次要优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.introduce && <GridGallery section={page.introduce} />}
          </Suspense>

          {/* 特性组件 - 次要优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.feature && <Feature section={page.feature} />}
          </Suspense>
        </>
      )}

      {/* 第三级组件，在次要组件加载完成后加载 */}
      {loadTertiary && (
        <>
          {/* 场景组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.scenarios && <QuoteCards section={page.scenarios} />}
          </Suspense>

          {/* 统计组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.stats && <Stats section={page.stats} />}
          </Suspense>

          {/* 定价组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.simple_pricing && <SimplePricing {...page.simple_pricing} />}
          </Suspense>

          {/* 推荐组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.testimonial && <Testimonial section={page.testimonial} />}
          </Suspense>

          {/* FAQ组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.faq && <FAQ section={page.faq} />}
          </Suspense>

          {/* CTA组件 - 第三级优先级 */}
          <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
            {page.cta && <CTA section={page.cta} />}
          </Suspense>
        </>
      )}
    </>
  );
}
