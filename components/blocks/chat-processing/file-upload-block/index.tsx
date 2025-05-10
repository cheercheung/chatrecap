"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { FileUploadBlockProps } from "@/types/chat-processing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * 文件上传组件
 *
 * 用于上传聊天记录文件并处理
 */
const FileUploadBlock: React.FC<FileUploadBlockProps> = ({
  platform,
  onUploadComplete,
  className
}) => {
  const t = useTranslations("chat_analysis");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  // 文件上传处理
  const handleUpload = async () => {
    if (!file) {
      setError(t("upload.no_file_selected"));
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    // 创建表单数据
    const formData = new FormData();
    formData.append("file", file);
    formData.append("platform", platform);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      // 发送上传请求
      const response = await fetch("/api/chat-processing/upload", {
        method: "POST",
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("upload.failed"));
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || t("upload.failed"));
      }

      setProgress(100);

      // 开始清洗文件
      const cleanResponse = await fetch("/api/chat-processing/clean", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileId: data.fileId,
          platform
        })
      });

      if (!cleanResponse.ok) {
        const errorData = await cleanResponse.json();
        throw new Error(errorData.message || t("processing.failed"));
      }

      // 通知上传完成
      onUploadComplete(data.fileId);
    } catch (error) {
      console.error("上传失败:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{t("upload.title")}</CardTitle>
        <CardDescription>{t("upload.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 文件选择区域 */}
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".txt,.json,.csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-lg font-medium mb-1">{t("upload.drop_files")}</p>
            <p className="text-sm text-muted-foreground mb-2">
              {t("upload.supported_formats")}
            </p>
            <Button variant="outline" type="button" disabled={uploading}>
              {t("upload.select_file")}
            </Button>
          </label>
        </div>

        {/* 选中的文件信息 */}
        {file && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        )}

        {/* 上传进度 */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("upload.uploading")}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("upload.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 上传按钮 */}
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? t("upload.uploading") : t("upload.upload_button")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUploadBlock;
