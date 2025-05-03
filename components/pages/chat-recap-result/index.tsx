"use client";

import React from "react";
import { AnalysisData } from "@/types/analysis";
import ChatRecapResultBlock from "@/components/blocks/chat-recap-result";

interface ChatRecapResultPageProps {
  analysisData: AnalysisData;
}

/**
 * Chat Recap Result Page Component
 * 
 * A complete page component that displays the chat analysis results.
 */
const ChatRecapResultPage: React.FC<ChatRecapResultPageProps> = ({ 
  analysisData 
}) => {
  return (
    <main>
      <ChatRecapResultBlock analysisData={analysisData} />
    </main>
  );
};

export default ChatRecapResultPage;
