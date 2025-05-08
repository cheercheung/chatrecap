import BlogClientWrapper from "@/components/blocks/blog/client-wrapper";
import { Blog as BlogType } from "@/types/blocks/blog";
import { getPostsByLocale } from "@/models/post";
import { getTranslations, getMessages } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 使用新的翻译系统，指定正确的命名空间
  const t = await getTranslations({ locale, namespace: 'blog' });

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/blog`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/blog`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 使用新的翻译系统，指定正确的命名空间
  const t = await getTranslations({ locale, namespace: 'blog' });

  const posts = await getPostsByLocale(locale);

  const blog: BlogType = {
    title: t("title"),
    description: t("description"),
    items: posts,
    read_more_text: t("read_more_text"),
  };

  // 获取翻译消息
  const messages = await getMessages({ locale });

  // 使用客户端包装组件，提供国际化上下文
  return (
    <BlogClientWrapper
      blog={blog}
      messages={messages}
      locale={locale}
    />
  );
}
