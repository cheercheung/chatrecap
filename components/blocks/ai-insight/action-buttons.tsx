'use client';

import React, { useState } from 'react';
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/**
 * AI Insight Result页面的操作按钮组件
 * 不包含"生成AI分析"按钮，因为该页面已经是AI分析结果页面
 */
export default function AiInsightActionButtons() {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  // 尝试使用 chatrecapresult 命名空间，如果不存在则使用默认值
  let t;
  try {
    t = useTranslations("chatrecapresult");
  } catch (error) {
    // 如果找不到 chatrecapresult 命名空间，使用一个函数返回默认值
    t = (key: string) => {
      const defaultValues: Record<string, any> = {
        "back_to_upload": "Back to Upload",
        "share_results": "Share Results",
        "share.link_copied": "Link copied to clipboard",
        "share.copy_failed": "Failed to copy link"
      };
      return key.includes('.')
        ? key.split('.').reduce((o, i) => o?.[i], defaultValues as any)
        : defaultValues[key] || key;
    };
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  // 返回上传页面
  const handleBack = () => {
    router.push('/chatrecapanalysis');
  };

  // 复制链接分享功能
  const handleShare = async () => {
    try {
      setIsSharing(true);

      // 构建分享 URL
      const shareUrl = new URL(window.location.href);

      // 确保 URL 包含 fileId
      if (fileId && !shareUrl.searchParams.has('fileId')) {
        shareUrl.searchParams.set('fileId', fileId);
      }

      // 复制链接到剪贴板
      await navigator.clipboard.writeText(shareUrl.toString());

      // 立即显示成功消息
      toast({
        title: t("share.link_copied") || "Link copied!",
        description: "The link has been copied to your clipboard. You can share it with your friends.",
      });
    } catch (error) {
      // 显示错误消息
      toast({
        title: t("share.copy_failed") || "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
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
        {/* PDF导出按钮暂时隐藏 */}

        <Button
          variant="outline"
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2"
        >
          {isSharing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("sharing") || "Sharing..."}
            </>
          ) : (
            <>
              <Share2 size={16} />
              {t("share_results")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
