"use client";

import React, { useState } from 'react';
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { PaymentTrigger } from '@/components/blocks/payment-trigger';

export default function ActionButtons() {
  const [isSharing, setIsSharing] = useState(false);

  // 使用标准的翻译方式，直接使用命名空间
  const componentT = useTranslations("components");
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

      // 显示成功消息
      toast.success(componentT('action_buttons.link_copied'), {
        description: componentT('action_buttons.description')
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error(componentT('action_buttons.copy_failed'), {
        description: componentT('action_buttons.description_error')
      });

      // 备选方案：提示用户手动复制
      alert('Please copy this link manually: ' + window.location.href);
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
        {componentT('action_buttons.back_to_upload')}
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
              {componentT('action_buttons.share_results')}
            </>
          )}
        </Button>

        {/* 支付按钮 - 仅当提供了fileId时显示 */}
        {fileId && <PaymentTrigger
          fileId={fileId}
          buttonText={"AI Recap"}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        />}
      </div>
    </div>
  );
}
