"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { Blog as BlogType } from "@/types/blocks/blog";
import Blog from "./index";

interface BlogClientWrapperProps {
  blog: BlogType;
  messages: Record<string, any>;
  locale: string;
}

/**
 * 博客页面客户端包装组件
 *
 * 使用 NextIntlClientProvider 提供翻译上下文
 */
const BlogClientWrapper: React.FC<BlogClientWrapperProps> = ({
  blog,
  messages,
  locale
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Blog blog={blog} />
    </NextIntlClientProvider>
  );
};

export default BlogClientWrapper;
