/**
 * 静态版本的 LandingSections 组件
 * 不包含任何动画，支持 SSG
 */
import { LandingPage } from '@/types/pages/landing';

// 静态导入所有组件
import Hero from "@/components/blocks/hero";
import CTA from '@/components/blocks/cta';
import FAQ from '@/components/blocks/faq';
import Feature from '@/components/blocks/feature';
import SimplePricingClientWrapper from '@/components/blocks/simple-pricing/client-wrapper';
import Stats from '@/components/blocks/stats';

export default function StaticLandingSections({ page }: { page: LandingPage }) {
  return (
    <>
      {/* 英雄区块 */}
      {page.hero && <Hero hero={page.hero} />}

      {/* 特性组件 */}
      {page.feature && <Feature section={page.feature} />}

      {/* 定价组件 */}
      {page.simple_pricing && (
        <SimplePricingClientWrapper
          data={page.simple_pricing}
          messages={page.simple_pricing}
        />
      )}

      {/* FAQ组件 */}
      {page.faq && <FAQ section={page.faq} />}

      {/* Stats组件 */}
      {page.stats && <Stats section={page.stats} />}

      {/* CTA组件 */}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
