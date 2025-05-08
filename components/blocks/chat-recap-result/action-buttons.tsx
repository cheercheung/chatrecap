"use client";

import React, { useState } from 'react';
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Share2, Loader2, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import { PaymentTrigger } from '@/components/blocks/payment-trigger';

export default function ActionButtons() {
  // 使用新的翻译系统，指定正确的命名空间
  const resultsT = useTranslations("results");
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  // 返回上传页面
  const handleBack = () => {
    router.push('/chatrecapanalysis');
  };

  // 尝试AI分析作为访客
  const handleTryAsGuest = () => {
    if (fileId) {
      router.push(`/ai-insight-result?fileId=${fileId}`);
    } else {
      toast.error("No file ID found", {
        description: "Please upload a chat file first"
      });
    }
  };

  // 登录获取更多AI分析
  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
      <div className="flex gap-3">
        <Button
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          onClick={handleTryAsGuest}
        >
          🎉 {resultsT("actions.try_ai_analysis")}
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleSignIn}
        >
          {resultsT("actions.sign_in_for_more")}
          <ArrowRight size={16} />
        </Button>
      </div>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleBack}
      >
        <RefreshCw size={16} />
        {resultsT("actions.new_analysis")}
      </Button>
    </div>
  );
}
