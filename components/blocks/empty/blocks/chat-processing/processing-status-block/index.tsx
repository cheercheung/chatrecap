"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ProcessingStatusBlockProps, FileStatus, ProcessResult } from "@/types/chat-processing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * 处理状态组件
 *
 * 显示文件处理的进度和状态
 */
const ProcessingStatusBlock: React.FC<ProcessingStatusBlockProps> = ({
  fileId,
  onProcessComplete,
  className
}) => {
  const t = useTranslations("chat_analysis");
  const [status, setStatus] = useState<FileStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 轮询处理状态
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/chat-processing/status/${fileId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || t("processing.status_fetch_failed"));
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || t("processing.status_fetch_failed"));
        }

        setStatus(data.status);

        // 如果处理完成，获取结果
        if (data.status.status === "completed") {
          clearInterval(intervalId);

          const resultResponse = await fetch(`/api/chat-processing/result/${fileId}`);

          if (!resultResponse.ok) {
            const errorData = await resultResponse.json();
            throw new Error(errorData.message || t("processing.result_fetch_failed"));
          }

          const resultData = await resultResponse.json();

          if (!resultData.success) {
            throw new Error(resultData.message || t("processing.result_fetch_failed"));
          }

          // 通知处理完成，确保使用响应中的fileId
          onProcessComplete(resultData.result as ProcessResult, resultData.fileId || fileId);
        } else if (data.status.status === "failed") {
          clearInterval(intervalId);
          setError(data.status.error || t("processing.failed"));
        }
      } catch (error) {
        console.error("获取处理状态失败:", error);
        setError(error instanceof Error ? error.message : String(error));
        clearInterval(intervalId);
      }
    };

    // 立即获取一次状态
    fetchStatus();

    // 每3秒轮询一次
    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fileId, onProcessComplete, t]);

  // 获取当前阶段的进度
  const getCurrentProgress = () => {
    if (!status) return 0;

    switch (status.status) {
      case "uploading":
        return 0;
      case "cleaning":
        return status.cleaningProgress * 0.5;
      case "analyzing":
        return 50 + status.analysisProgress * 0.5;
      case "completed":
        return 100;
      case "failed":
        return 0;
      default:
        return 0;
    }
  };

  // 获取当前步骤文本
  const getCurrentStep = () => {
    if (!status) return t("processing.preparing");

    switch (status.status) {
      case "uploading":
        return t("processing.uploading");
      case "cleaning":
        return status.currentCleaningStep || t("processing.cleaning");
      case "analyzing":
        return status.currentAnalysisStep || t("processing.analyzing");
      case "completed":
        return t("processing.completed");
      case "failed":
        return t("processing.failed");
      default:
        return t("processing.preparing");
    }
  };

  // 获取状态图标
  const getStatusIcon = () => {
    if (!status) return <Clock className="h-5 w-5 text-muted-foreground" />;

    switch (status.status) {
      case "uploading":
      case "cleaning":
      case "analyzing":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <CardTitle>{t("processing.title")}</CardTitle>
        </div>
        <CardDescription>{t("processing.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 总进度 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              {getCurrentStep()}
            </span>
            <span>{Math.round(getCurrentProgress())}%</span>
          </div>
          <Progress value={getCurrentProgress()} className="h-2" />
        </div>

        {/* 清洗进度 */}
        {status && status.status !== "uploading" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("processing.cleaning_progress")}</span>
              <span>{status.cleaningProgress}%</span>
            </div>
            <Progress value={status.cleaningProgress} className="h-1.5" />
          </div>
        )}

        {/* 分析进度 */}
        {status && (status.status === "analyzing" || status.status === "completed") && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("processing.analysis_progress")}</span>
              <span>{status.analysisProgress}%</span>
            </div>
            <Progress value={status.analysisProgress} className="h-1.5" />
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingStatusBlock;
