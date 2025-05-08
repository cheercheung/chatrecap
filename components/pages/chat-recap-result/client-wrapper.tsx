"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { AnalysisData } from "@/types/analysis";
import ChatRecapResultBlock from "@/components/blocks/chat-recap-result";

// 导入翻译文件
import resultsTranslations from "@/i18n/en/results.json";
import commonTranslations from "@/i18n/en/common.json";

interface ClientWrapperProps {
  analysisData: AnalysisData;
  messages: Record<string, any>;
  locale: string;
}

/**
 * Client Wrapper Component
 *
 * This component wraps the StaticChatRecapResultPage with NextIntlClientProvider
 * to provide translation context for client components.
 */
const ClientWrapper: React.FC<ClientWrapperProps> = ({
  analysisData,
  messages,
  locale
}) => {
  // 合并翻译消息，确保翻译键可用
  const combinedMessages = {
    ...messages,
    ...resultsTranslations,
    common: commonTranslations
  };

  return (
    <NextIntlClientProvider locale={locale} messages={combinedMessages}>
      <main>
        <ChatRecapResultBlock analysisData={analysisData} />
      </main>
    </NextIntlClientProvider>
  );
};

export default ClientWrapper;
