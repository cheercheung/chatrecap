"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { ChatRecapAnalysisPageProps } from "@/types/chat-processing";
import ChatRecapAnalysisPage from "./index";

interface ChatRecapAnalysisClientWrapperProps {
  title: string;
  subtitle: string;
  description: string;
  uploadBoxData: any;
  platform?: string;
  className?: string;
  messages: Record<string, any>;
  locale: string;
}

/**
 * 聊天分析页面客户端包装组件
 *
 * 使用 NextIntlClientProvider 提供翻译上下文
 */
const ChatRecapAnalysisClientWrapper: React.FC<ChatRecapAnalysisClientWrapperProps> = ({
  title,
  subtitle,
  description,
  uploadBoxData,
  platform = "whatsapp",
  className,
  messages,
  locale
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ChatRecapAnalysisPage
        title={title}
        subtitle={subtitle}
        description={description}
        uploadBoxData={uploadBoxData}
        platform={platform}
        className={className}
      />
    </NextIntlClientProvider>
  );
};

export default ChatRecapAnalysisClientWrapper;
