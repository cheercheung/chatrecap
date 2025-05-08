// 使用增量静态再生成 (ISR)，每24小时重新验证一次
// 这样页面会在构建时预渲染，并在后台定期更新
export const revalidate = 86400; // 24小时 = 86400秒

// 强制使用静态生成，提高首页加载性能
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

import Hero from '@/components/blocks/hero';
import LazySecondarySections from '@/components/blocks/lazy-secondary-sections';
import PlatformUploadWrapper from '@/components/blocks/platform-upload/client-wrapper';
// 导入静态翻译，替代动态加载
import { landingTranslations } from '@/lib/static-translations';

export async function generateMetadata({ params }) {
  const { locale } = await params;

  // 使用静态翻译，不再动态加载
  const meta = landingTranslations.seo.pages.home;

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    // 你还可以加 openGraph, twitter, robots 等
  };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  // 我们不再需要使用locale参数，因为我们使用静态翻译
  await params;

  // 使用静态翻译，不再动态加载
  // 从静态翻译中获取所需数据
  const hero = landingTranslations.landing.hero;

  // 由于类型问题，我们需要转换hero对象以符合Hero接口
  // 特别是buttons属性需要是Button[]类型
  const heroWithCorrectTypes = {
    ...hero,
    // 确保buttons是数组
    buttons: Array.isArray(hero.buttons)
      ? hero.buttons
      : hero.buttons?.free_analyze
        ? [{
            title: hero.buttons.free_analyze,
            // 确保variant是ButtonVariant类型
            variant: "default" as const
          }]
        : []
  };

  // 获取其他需要的数据
  // 注意：如果这些属性在landingTranslations.landing中不存在，我们需要提供默认值
  const platformUploadSection = {
    title: "How to export Your Chat Data",
    description: "Select your messaging platform and upload your chat data for analysis"
  };

  const uploadBoxData = {
    title: landingTranslations.upload.title,
    description: landingTranslations.upload.description,
    placeholder: landingTranslations.upload.placeholder,
    supported_formats: landingTranslations.upload.supported_formats,
    sample_button_text: landingTranslations.upload.sample_button_text,
    upload_button_text: landingTranslations.upload.upload_button_text,
    primary_button: {
      title: "AI Recap",
      url: "/#recap",
      target: "_self",
      variant: "default" as const
    },
    secondary_button: {
      title: "FREE Analyze",
      url: "/chatrecapresult",
      target: "_self",
      variant: "secondary" as const
    }
  };

  // 构建完整的页面数据
  // 这里我们需要确保数据符合LandingPage接口
  // 特别是simple_pricing.plans需要符合PricingPlan[]类型
  const simplePricingPlans = landingTranslations.landing.simple_pricing?.plans?.map(plan => ({
    title: plan.title || "",
    description: plan.description || "",
    price: plan.price || "",
    buttonText: plan.buttonText || "",
    buttonUrl: "/payment", // 添加必需的buttonUrl
    productId: "product_" + plan.title?.toLowerCase().replace(/\s+/g, '_') || "product_default", // 添加必需的productId
    features: Array.isArray(plan.features)
      ? plan.features.map(feature => ({ text: feature }))
      : [],
    popularLabel: plan.popularLabel,
    tipText: plan.tipText
  }));

  // 修复CTA的buttons类型问题
  const ctaData = landingTranslations.landing.cta;
  const fixedCta = {
    ...ctaData,
    buttons: Array.isArray(ctaData?.buttons)
      ? ctaData.buttons
      : ctaData?.buttons?.title
        ? [{
            title: ctaData.buttons.title,
            variant: "default" as const
          }]
        : []
  };

  const pageData = {
    feature: landingTranslations.landing.feature,
    simple_pricing: {
      title: landingTranslations.landing.simple_pricing?.title || "",
      description: landingTranslations.landing.simple_pricing?.description || "",
      plans: simplePricingPlans || []
    },
    faq: landingTranslations.landing.faq,
    stats: landingTranslations.landing.stats,
    cta: fixedCta
  };

  return (
    <>
      {/* Hero 区块 */}
      {heroWithCorrectTypes && <Hero hero={heroWithCorrectTypes} />}

      {/* 上传区块，仅客户端渲染 */}
      <PlatformUploadWrapper
        section={platformUploadSection}
        upload_box={uploadBoxData}
      />

      {/* 次屏懒加载区块 */}
      <LazySecondarySections page={pageData} />
    </>
  );
}
