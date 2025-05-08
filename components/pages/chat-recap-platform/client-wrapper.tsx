"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { ChatRecapPlatformPageProps } from "./types";
import ChatRecapPlatformPage from "./index";

interface ChatRecapPlatformClientWrapperProps extends ChatRecapPlatformPageProps {
  messages: Record<string, any>;
  locale: string;
}

/**
 * 聊天平台页面客户端包装组件
 *
 * 使用 NextIntlClientProvider 提供翻译上下文
 */
const ChatRecapPlatformClientWrapper: React.FC<ChatRecapPlatformClientWrapperProps> = ({
  pageTitle,
  pageDescription,
  platforms,
  guideText,
  className,
  messages,
  locale
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ChatRecapPlatformPage
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        platforms={platforms}
        guideText={guideText}
        className={className}
      />
    </NextIntlClientProvider>
  );
};

export default ChatRecapPlatformClientWrapper;
