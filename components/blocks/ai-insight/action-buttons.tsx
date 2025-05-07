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

  // 直接使用顶级命名空间 components
  const t = useTranslations("components");
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
        title: t('action_buttons.link_copied'),
        description: t('action_buttons.description'),
      });
    } catch (error) {
      // 显示错误消息
      toast({
        title: t('action_buttons.copy_failed'),
        description: t('action_buttons.description_error'),
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
        {t('action_buttons.back_to_upload')}
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
              {"Sharing..."}
            </>
          ) : (
            <>
              <Share2 size={16} />
              {t('action_buttons.share_results')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
