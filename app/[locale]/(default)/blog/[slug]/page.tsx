import { PostStatus, findPostBySlug } from "@/models/post";
import { getMessages } from "next-intl/server";
import BlogDetailClientWrapper from "@/components/blocks/blog-detail/client-wrapper";
import Empty from "@/components/blocks/empty";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = await findPostBySlug(slug, locale);

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/blog/${slug}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/blog/${slug}`;
  }

  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await findPostBySlug(slug, locale);

  if (!post || post.status !== PostStatus.Online) {
    return <Empty message="Post not found" />;
  }

  // 获取翻译消息
  const messages = await getMessages({ locale });

  // 使用客户端包装组件，提供国际化上下文
  return (
    <BlogDetailClientWrapper
      post={post}
      messages={messages}
      locale={locale}
    />
  );
}
