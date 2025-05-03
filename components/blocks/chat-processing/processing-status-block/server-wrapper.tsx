"use client";

import { useTranslations } from "next-intl";
import ProcessingStatusBlock from "./index";
import { ProcessResult } from "@/types/chat-processing";

export interface ProcessingStatusBlockServerWrapperProps {
  fileId: string;
  onProcessComplete: (result: ProcessResult, fileId?: string) => void;
  className?: string;
}

/**
 * 客户端包装组件，用于获取翻译并传递给ProcessingStatusBlock组件
 */
export default function ProcessingStatusBlockServerWrapper({
  fileId,
  onProcessComplete,
  className
}: ProcessingStatusBlockServerWrapperProps) {
  // 在客户端获取翻译
  const t = useTranslations("chat_analysis");

  // 将翻译后的文本传递给客户端组件
  return (
    <ProcessingStatusBlock
      fileId={fileId}
      onProcessComplete={onProcessComplete}
      className={className}
      translations={{
        title: t("processing.title"),
        description: t("processing.description"),
        preparing: t("processing.preparing"),
        uploading: t("processing.uploading"),
        cleaning: t("processing.cleaning"),
        analyzing: t("processing.analyzing"),
        completed: t("processing.completed"),
        failed: t("processing.failed"),
        statusFetchFailed: t("processing.status_fetch_failed"),
        resultFetchFailed: t("processing.result_fetch_failed"),
        cleaningProgress: t("processing.cleaning_progress"),
        analysisProgress: t("processing.analysis_progress")
      }}
    />
  );
}
