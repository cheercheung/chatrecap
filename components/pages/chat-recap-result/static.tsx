"use client";

import React from "react";
import { AnalysisData } from "@/types/analysis";
import ChatRecapResultBlock from "@/components/blocks/chat-recap-result";

interface StaticChatRecapResultPageProps {
  analysisData: AnalysisData;
}

/**
 * Static Chat Recap Result Page Component
 *
 * An optimized version of the chat recap result page for sample data.
 * This component is designed to be lightweight and fast to render.
 *
 * Now using the updated ChatRecapResultBlock component to ensure
 * consistent layout and styling across all result pages.
 */
const StaticChatRecapResultPage: React.FC<StaticChatRecapResultPageProps> = ({
  analysisData
}) => {
  return (
    <main>
      <ChatRecapResultBlock analysisData={analysisData} />
    </main>
  );
};

export default StaticChatRecapResultPage;
