
// 使用增量静态再生成 (ISR)，每24小时重新验证一次
// 这样页面会在构建时预渲染，并在后台定期更新
export const revalidate = 86400; // 24小时 = 86400秒

import { Suspense } from "react";
import LandingSections from "@/components/blocks/landing-sections";
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl">加载中...</div>
    </div>}>
      <LandingSections page={page} />
    </Suspense>
  );
}
