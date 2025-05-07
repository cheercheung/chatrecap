'use client';

import { LandingPage } from '@/types/pages/landing';

// 静态导入关键组件（首屏显示的组件）
import Hero from "@/components/blocks/hero";

// 静态导入所有组件，不使用动态加载
import CTA from '@/components/blocks/cta';
import FAQ from '@/components/blocks/faq';
import Feature from '@/components/blocks/feature';
import PlatformUpload from '@/components/blocks/platform-upload';
import SimplePricing from '@/components/blocks/simple-pricing';
import Stats from '@/components/blocks/stats';

export default function LandingSections({ page }: { page: LandingPage }) {
  return (
    <>
      {/* 英雄区块 */}
      {page.hero && <Hero hero={page.hero} />}

      {/* 平台上传组件 */}
      {page.platform_upload && page.upload_box && (
        <PlatformUpload section={page.platform_upload} upload_box={page.upload_box} />
      )}

      {/* 特性组件 */}
      {page.feature && <Feature section={page.feature} />}

      {/* 定价组件 */}
      {page.simple_pricing && <SimplePricing {...page.simple_pricing} />}

      {/* FAQ组件 */}
      {page.faq && <FAQ section={page.faq} />}

      {/* Stats组件 */}
      {page.stats && <Stats section={page.stats} />}

      {/* CTA组件 */}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
