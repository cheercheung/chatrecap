"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatRecapAnalysisPageProps } from "@/types/chat-processing";
import { ProcessResult, PlatformType } from "@/services/chat-processing/types";
import FileUploadBlock from "@/components/blocks/chat-processing/file-upload-block";
import ProcessingStatusBlockWrapper from "@/components/blocks/chat-processing/processing-status-block/server-wrapper";
import { HeartBeat } from "@/components/ui/heart-beat";
import { Badge } from "@/components/ui/badge";
import PlatformUpload from "@/components/blocks/platform-upload";

/**
 * 聊天分析页面组件
 *
 * 用于上传和处理聊天记录文件
 */
const ChatRecapAnalysisPage: React.FC<ChatRecapAnalysisPageProps> = ({
  platform = "whatsapp",
  className,
  title,
  subtitle,
  description,
  uploadBoxData
}) => {
  // 使用从服务器端传递的已翻译文本
  const router = useRouter();
  const [fileId, setFileId] = useState<string | null>(null);

  // 处理上传完成
  const handleUploadComplete = (uploadedFileId: string) => {
    setFileId(uploadedFileId);
  };

  // 处理处理完成
  const handleProcessComplete = (result: ProcessResult, resultFileId?: string) => {
    // 将结果保存到会话存储
    sessionStorage.setItem("chatProcessingResult", JSON.stringify(result));

    // 使用响应中的fileId或当前fileId
    const finalFileId = resultFileId || fileId;

    // 跳转到结果页面
    router.push(`/chatrecapresult?fileId=${finalFileId}`);
  };

  // 获取平台名称
  const getPlatformName = () => {
    switch (platform) {
      case "whatsapp":
        return "WhatsApp";
      case "instagram":
        return "Instagram";
      case "discord":
        return "Discord";
      case "telegram":
        return "Telegram";
      case "snapchat":
        return "Snapchat";
      default:
        return platform;
    }
  };

  // If we're in the file upload/processing flow
  if (fileId) {
    return (
      <main className={`container py-10 ${className}`}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">
            {title}
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            {description}
          </p>

          <ProcessingStatusBlockWrapper
            fileId={fileId}
            onProcessComplete={handleProcessComplete}
          />
        </div>
      </main>
    );
  }

  // Main page with platform upload
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 relative overflow-hidden">
        <HeartBeat className="absolute inset-0 opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
              {subtitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <PlatformUpload 
            upload_box={uploadBoxData}
            section={{
              title: "",
              description: ""
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default ChatRecapAnalysisPage;
