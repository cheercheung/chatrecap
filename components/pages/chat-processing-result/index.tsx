"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ChatRecapResultPageProps } from "@/types/chat-processing";
import ResultSummaryBlock from "@/components/blocks/chat-processing/result-summary-block";
import MessageListBlock from "@/components/blocks/chat-processing/message-list-block";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * 聊天处理结果页面组件
 *
 * 显示聊天分析结果
 */
const ChatProcessingResultPage: React.FC<ChatRecapResultPageProps> = ({
  result,
  className
}) => {
  const t = useTranslations("chat_analysis");
  const router = useRouter();

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理导出
  const handleExport = () => {
    // 创建导出数据
    const exportData = {
      result,
      exportedAt: new Date().toISOString()
    };

    // 转换为JSON字符串
    const jsonString = JSON.stringify(exportData, null, 2);

    // 创建Blob
    const blob = new Blob([jsonString], { type: "application/json" });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-analysis-${new Date().toISOString().split("T")[0]}.json`;

    // 触发下载
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 处理分享
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("results.share_title"),
          text: t("results.share_text", { count: result.messages.length }),
          url: window.location.href
        });
      } catch (error) {
        console.error("分享失败:", error);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert(t("results.link_copied"));
    }
  };

  return (
    <main className={`container py-10 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {t("results.title")}
        </h1>
        <p className="text-muted-foreground mb-6 text-center">
          {t("results.description")}
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("results.back")}
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t("results.export")}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            {t("results.share")}
          </Button>
        </div>

        {/* 结果摘要 */}
        <ResultSummaryBlock result={result} className="mb-6" />

        {/* 消息列表 */}
        <MessageListBlock messages={result.messages} />
      </div>
    </main>
  );
};

export default ChatProcessingResultPage;
