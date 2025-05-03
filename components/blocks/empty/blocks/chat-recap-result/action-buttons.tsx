"use client";

import React from 'react';
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
// import { useToast } from '@/components/ui/use-toast';
import AiAnalysisButton from '@/components/blocks/analysis-actions/ai-analysis-button';

export default function ActionButtons() {
  const t = useTranslations("chatrecapresult");
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  // const { toast } = useToast();

  // Handle back button click
  const handleBack = () => {
    router.push('/chatrecapanalysis');
  };

  // Handle export button click (placeholder)
  const handleExport = () => {
    alert(t("export_not_implemented"));
  };

  // Handle share button click (placeholder)
  const handleShare = () => {
    alert(t("share_not_implemented"));
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
      <Button
        variant="outline"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        {t("back_to_upload")}
      </Button>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {t("export_pdf")}
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          {t("share_results")}
        </Button>

        {/* AI分析按钮 - 仅当提供了fileId时显示 */}
        {fileId && <AiAnalysisButton fileId={fileId} />}
      </div>
    </div>
  );
}
