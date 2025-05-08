"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { Post } from "@/types/post";
import BlogDetail from "./index";

interface BlogDetailClientWrapperProps {
  post: Post;
  messages: Record<string, any>;
  locale: string;
}

/**
 * 博客详情页面客户端包装组件
 *
 * 使用 NextIntlClientProvider 提供翻译上下文
 */
const BlogDetailClientWrapper: React.FC<BlogDetailClientWrapperProps> = ({
  post,
  messages,
  locale
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <BlogDetail post={post} />
    </NextIntlClientProvider>
  );
};

export default BlogDetailClientWrapper;
