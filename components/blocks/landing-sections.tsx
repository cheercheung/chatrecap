'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LandingPage } from '@/types/pages/landing';

// 静态导入关键组件（首屏显示的组件）
import OptimizedHero from "@/components/blocks/hero/optimized";
import NotificationBlockWrapper from "@/components/blocks/notification-block/client-wrapper";

// 动态导入非关键组件（延迟加载）
const CTA = dynamic(() => import('@/components/blocks/cta'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const FAQ = dynamic(() => import('@/components/blocks/faq'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const Feature = dynamic(() => import('@/components/blocks/feature'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const GridGallery = dynamic(() => import('@/components/blocks/grid-gallery'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const QuoteCards = dynamic(() => import('@/components/blocks/quote-cards'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const PlatformUpload = dynamic(() => import('@/components/blocks/platform-upload'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const SimplePricing = dynamic(() => import('@/components/blocks/simple-pricing'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const Stats = dynamic(() => import('@/components/blocks/stats'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

const Testimonial = dynamic(() => import('@/components/blocks/testimonial'), {
  loading: () => <div className="py-16 bg-muted/30 animate-pulse"></div>
});

export default function LandingSections({ page }: { page: LandingPage }) {
  return (
    <>
      {/* 添加通知区块 - 关键组件，立即加载 */}
      <NotificationBlockWrapper />

      {/* 英雄区块 - 关键组件，立即加载 */}
      {page.hero && <OptimizedHero hero={page.hero} />}

      {/* 非关键组件，使用 Suspense 延迟加载 */}
      <Suspense>
        {page.platform_upload && page.upload_box && (
          <PlatformUpload section={page.platform_upload} upload_box={page.upload_box} />
        )}
      </Suspense>

      <Suspense>
        {page.introduce && <GridGallery section={page.introduce} />}
      </Suspense>

      <Suspense>
        {page.feature && <Feature section={page.feature} />}
      </Suspense>

      <Suspense>
        {page.scenarios && <QuoteCards section={page.scenarios} />}
      </Suspense>

      <Suspense>
        {page.stats && <Stats section={page.stats} />}
      </Suspense>

      <Suspense>
        {page.simple_pricing && <SimplePricing {...page.simple_pricing} />}
      </Suspense>

      <Suspense>
        {page.testimonial && <Testimonial section={page.testimonial} />}
      </Suspense>

      <Suspense>
        {page.faq && <FAQ section={page.faq} />}
      </Suspense>

      <Suspense>
        {page.cta && <CTA section={page.cta} />}
      </Suspense>
    </>
  );
}
