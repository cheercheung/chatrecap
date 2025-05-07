// 使用增量静态再生成 (ISR)，每24小时重新验证一次
// 这样页面会在构建时预渲染，并在后台定期更新
export const revalidate = 86400; // 24小时 = 86400秒

// 强制使用静态生成，提高首页加载性能
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

import OptimizedHero from '@/components/blocks/hero/optimized';
import LazySecondarySections from '@/components/blocks/lazy-secondary-sections';
import PlatformUploadWrapper from '@/components/blocks/platform-upload/client-wrapper';
import NotificationBlockWrapper from '@/components/blocks/notification-block/client-wrapper';
import { getLandingPage } from "@/services/page";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  // 默认英文
  let meta = {
    title: "Chat Recap - AI Chat Analysis Tool",
    description: "Analyze your chat history with AI to gain insights into your relationships and communication patterns.",
    keywords: "chat, ai, analysis, ...",
  };

  // 动态加载多语言 landing 配置
  try {
    const module = await import(`@/i18n/pages/landing/${locale}.json`);
    if (module.default && module.default.metadata) {
      meta = module.default.metadata;
    }
  } catch (e) {
    // fallback to英文
  }

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
  const { locale } = await params;
  const page = await getLandingPage(locale);
  // 拆出 primary 数据
  const { hero, platform_upload, upload_box, ...restPage } = page;

  return (
    <>
      {/* Hero 区块 */}
      {hero && <OptimizedHero hero={hero} />}
      {/* 上传区块，仅客户端渲染 */}
      {platform_upload && upload_box && (
        <PlatformUploadWrapper section={platform_upload} upload_box={upload_box} />
      )}
      {/* 次屏懒加载区块 */}
      <LazySecondarySections page={restPage as typeof page} />
      <NotificationBlockWrapper />
    </>
  );
}
