"use client";

import React, { useEffect, useState } from "react";
import { ProcessingStatusBlockProps, FileStatus, ProcessResult } from "@/types/chat-processing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 定义翻译文本接口
interface ProcessingTranslations {
  title: string;
  description: string;
  preparing: string;
  uploading: string;
  cleaning: string;
  analyzing: string;
  completed: string;
  failed: string;
  statusFetchFailed: string;
  resultFetchFailed: string;
  cleaningProgress: string;
  analysisProgress: string;
}

/**
 * 处理状态组件
 *
 * 显示文件处理的进度和状态
 */
const ProcessingStatusBlock: React.FC<ProcessingStatusBlockProps> = ({
  fileId,
  onProcessComplete,
  className,
  translations
}) => {
  // 使用传入的翻译文本
  const t = translations as ProcessingTranslations;
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
          throw new Error(errorData.message || t.statusFetchFailed);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || t.statusFetchFailed);
        }

        setStatus(data.status);

        // 如果处理完成，获取结果
        if (data.status.status === "completed") {
          clearInterval(intervalId);

          const resultResponse = await fetch(`/api/chat-processing/result/${fileId}`);

          if (!resultResponse.ok) {
            const errorData = await resultResponse.json();
            throw new Error(errorData.message || t.resultFetchFailed);
          }

          const resultData = await resultResponse.json();

          if (!resultData.success) {
            throw new Error(resultData.message || t.resultFetchFailed);
          }

          // 通知处理完成，确保使用响应中的fileId
          onProcessComplete(resultData.result as ProcessResult, resultData.fileId || fileId);
        } else if (data.status.status === "failed") {
          clearInterval(intervalId);
          setError(data.status.error || t.failed);
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
    if (!status) return t.preparing;

    switch (status.status) {
      case "uploading":
        return t.uploading;
      case "cleaning":
        return status.currentCleaningStep || t.cleaning;
      case "analyzing":
        return status.currentAnalysisStep || t.analyzing;
      case "completed":
        return t.completed;
      case "failed":
        return t.failed;
      default:
        return t.preparing;
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
          <CardTitle>{t.title}</CardTitle>
        </div>
        <CardDescription>{t.description}</CardDescription>
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
              <span>{t.cleaningProgress}</span>
              <span>{status.cleaningProgress}%</span>
            </div>
            <Progress value={status.cleaningProgress} className="h-1.5" />
          </div>
        )}

        {/* 分析进度 */}
        {status && (status.status === "analyzing" || status.status === "completed") && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t.analysisProgress}</span>
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
