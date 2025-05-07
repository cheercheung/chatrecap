"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { AnalysisData } from "@/types/analysis";
import StaticChatRecapResultPage from "./static";

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
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StaticChatRecapResultPage analysisData={analysisData} />
    </NextIntlClientProvider>
  );
};

export default ClientWrapper;
