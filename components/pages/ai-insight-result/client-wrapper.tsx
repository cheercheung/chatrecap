"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { AnalysisData } from "@/types/analysis";
import StaticAiInsightResultPage from "./static";
import { FeatureItem } from "@/components/blocks/ai-insight/types";

interface ClientWrapperProps {
  analysisData: AnalysisData;
  mappedInsights: FeatureItem[];
  messages: Record<string, any>;
  locale: string;
}

/**
 * Client Wrapper Component
 * 
 * This component wraps the StaticAiInsightResultPage with NextIntlClientProvider
 * to provide translation context for client components.
 */
const ClientWrapper: React.FC<ClientWrapperProps> = ({ 
  analysisData,
  mappedInsights,
  messages,
  locale
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StaticAiInsightResultPage 
        analysisData={analysisData} 
        mappedInsights={mappedInsights} 
      />
    </NextIntlClientProvider>
  );
};

export default ClientWrapper;
