"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { RiUploadCloud2Line } from "react-icons/ri";
import Icon from "@/components/icon";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import {
  uploadChatFile,
  processChatFile,
  PlatformType
} from "@/services/chat-processing";

interface JsonUploaderProps {
  supportedPlatform?: string;
  maxFileSize?: number;
  maxMessageCount?: number;
  maxCharacters?: number;
  onFileUpload?: (file: File) => void;
  analyzeButton?: {
    title?: string;
    url?: string;
    target?: string;
    icon?: string;
    variant?: string;
  };

  platform?: PlatformType;
}

export default function JsonUploader({
  supportedPlatform = "JSON",
  maxFileSize = 5,
  maxMessageCount = 10000,
  maxCharacters = 1000000,
  onFileUpload,
  analyzeButton,

  platform = "whatsapp" as PlatformType
}: JsonUploaderProps) {
  const router = useRouter();
  const t = useTranslations("chat_analysis");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);



  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }

    // Check file extension
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const supportedExtensions = [".json", ".txt", ".csv"];

    if (!supportedExtensions.includes(fileExtension)) {
      alert(`Invalid file format. Supported formats: ${supportedExtensions.join(", ")}`);
      return;
    }

    setFileName(file.name);
    setFile(file);
    setIsSampleData(false); // 用户上传了自己的文件，不是示例数据

    if (onFileUpload) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 处理文件上传和处理
  const processFile = async (redirectPath: string) => {
    if (!file && !isSampleData) {
      setError("Please select a file or use sample data first");
      return;
    }

    // 如果是示例数据，直接跳转到示例结果页面
    if (isSampleData) {
      router.push(`${redirectPath}/sample`);
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 创建表单数据
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("platform", platform);

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

      // 上传文件
      const uploadResult = await uploadChatFile(file, platform);

      clearInterval(progressInterval);

      setProgress(100);
      setFileId(uploadResult.fileId);

      // 开始处理文件
      setProcessing(true);

      // 根据平台选择不同的处理方法
      let response;
      try {
        if (platform === 'instagram') {
          response = await fetch('/api/chat-processing/instagram', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId: uploadResult.fileId })
          });
        } else if (platform === 'snapchat') {
          response = await fetch('/api/chat-processing/snapchat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId: uploadResult.fileId })
          });
        } else if (platform === 'discord') {
          response = await fetch('/api/chat-processing/discord', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId: uploadResult.fileId })
          });
        } else if (platform === 'telegram') {
          response = await fetch('/api/chat-processing/telegram', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId: uploadResult.fileId })
          });
        } else {
          // 默认使用通用处理方法
          await processChatFile(uploadResult.fileId, platform);
          // 设置一个成功的响应
          response = new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 检查响应
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `处理${platform}数据失败`);
        }
      } catch (error) {
        console.error(`处理${platform}数据失败:`, error);
        throw error;
      }

      // 轮询处理状态，直到完成或失败
      let isCompleted = false;
      let retryCount = 0;
      const maxRetries = 30; // 最多等待30次，每次1秒，总共30秒

      while (!isCompleted && retryCount < maxRetries) {
        try {
          // 获取处理状态
          console.log(`正在获取处理状态: ${uploadResult.fileId}, 尝试次数: ${retryCount + 1}`);
          const statusUrl = `/api/chat-processing/status/${uploadResult.fileId}`;
          console.log('状态URL:', statusUrl);
          const statusResponse = await fetch(statusUrl);

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            console.log('处理状态:', statusData);

            if (statusData.success && statusData.status) {
              const currentStatus = statusData.status;
              console.log('当前状态:', currentStatus.status);

              // 更新进度
              if (currentStatus.status === 'completed') {
                console.log('处理完成');
                isCompleted = true;
                setProgress(100);
              } else if (currentStatus.status === 'failed') {
                console.log('处理失败:', currentStatus.error);
                throw new Error(currentStatus.error || '处理失败');
              } else {
                // 更新进度显示
                const progressValue = currentStatus.status === 'cleaning'
                  ? currentStatus.cleaningProgress
                  : currentStatus.analysisProgress;

                console.log(`处理中: ${currentStatus.status}, 进度: ${progressValue}%`);
                setProgress(progressValue);
              }
            } else {
              console.log('无效的状态数据:', statusData);
            }
          } else {
            console.log('获取状态失败:', statusResponse.status);
          }

          // 如果还没完成，等待1秒后再次检查
          if (!isCompleted) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            retryCount++;
          }
        } catch (error) {
          console.error('获取处理状态失败:', error);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 如果达到最大重试次数但仍未完成，显示警告
      if (!isCompleted) {
        console.warn('处理超时，但仍将继续处理');
      }

      // 重定向到结果页面
      router.push(`${redirectPath}?fileId=${uploadResult.fileId}`);

    } catch (error) {
      console.error("Processing failed:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  // 处理分析按钮点击
  const handleAnalyzeClick = () => {
    const redirectPath = analyzeButton?.url || "/chatrecapanalysis";
    processFile(redirectPath);
  };



  return (
    <section className="py-8 relative">
      <div className="container max-w-4xl">

        <Card className="border border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="border-2 border-dashed border-primary/20 rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
              onClick={handleUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".json,.txt,.csv"
              />

              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <RiUploadCloud2Line className="w-16 h-16 text-primary/40 mb-4" />
              </motion.div>

              <p className="text-lg font-medium text-primary mb-2">
                Click to upload your {supportedPlatform} file
              </p>

              {fileName ? (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground flex items-center"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Selected: {fileName}
                </motion.p>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground">Messages will be auto sorted by timestamp.</p>
                  <p className="text-sm text-muted-foreground">Max message count: {maxMessageCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Max characters: {maxCharacters.toLocaleString()}</p>
                </motion.div>
              )}
            </motion.div>



            {/* 错误信息显示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* 上传进度显示 */}
            {uploading && (
              <div className="mb-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {processing ? "Processing data..." : `Uploading: ${progress}%`}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              {analyzeButton && (
                <Button
                  variant={analyzeButton.variant as any || "secondary"}
                  className="w-full sm:w-auto"
                  disabled={!fileName || uploading || processing}
                  onClick={handleAnalyzeClick}
                >
                  {uploading || processing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {processing ? "Processing..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      {analyzeButton.icon && (
                        <Icon name={analyzeButton.icon} className="mr-2" />
                      )}
                      {analyzeButton.title || "FREE Analyze"}
                    </>
                  )}
                </Button>
              )}


            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
