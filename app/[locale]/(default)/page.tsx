
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import GridGallery from "@/components/blocks/grid-gallery";
import QuoteCards from "@/components/blocks/quote-cards";
import PlatformUpload from "@/components/blocks/platform-upload";
import NotificationBlockWrapper from "@/components/blocks/notification-block/client-wrapper";

import Hero from "@/components/blocks/hero";
import SimplePricing from "@/components/blocks/simple-pricing";

// 强制使用服务器端渲染
export const dynamic = 'force-dynamic';

import Stats from "@/components/blocks/stats";
import Testimonial from "@/components/blocks/testimonial";
import { getLandingPage } from "@/services/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 确保 params 已经被 await
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 确保 params 已经被 await
  const { locale } = await params;
  const page = await getLandingPage(locale);

  return (
    <>
      {/* 添加通知区块 */}
      <NotificationBlockWrapper />

      {page.hero && <Hero hero={page.hero} />}
      {page.platform_upload && page.upload_box && (
        <PlatformUpload section={page.platform_upload} upload_box={page.upload_box} />
      )}
      {page.introduce && <GridGallery section={page.introduce} />}
      {page.feature && <Feature section={page.feature} />}
      {page.scenarios && <QuoteCards section={page.scenarios} />}
      {page.stats && <Stats section={page.stats} />}
      {page.simple_pricing && <SimplePricing {...page.simple_pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
