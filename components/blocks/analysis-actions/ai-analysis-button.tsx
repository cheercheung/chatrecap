'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { generateAiAnalysis } from '@/services/chat-processing';
import { useRouter } from 'next/navigation';

interface AiAnalysisButtonProps {
  fileId: string;
  className?: string;
}

/**
 * AI分析按钮组件
 * 用于触发AI分析并显示分析状态
 */
const AiAnalysisButton: React.FC<AiAnalysisButtonProps> = ({ fileId, className }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const { toast } = useToast();
  const t = useTranslations('chatrecapresult');
  const router = useRouter();

  // 处理AI分析
  const handleAiAnalysis = async () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // 显示开始分析的提示
      alert(t('ai_analysis.starting') + ': ' + t('ai_analysis.please_wait'));

      // 获取当前语言
      const locale = document.documentElement.lang || 'en';

      // 调用AI分析服务，传递语言参数
      const result = await generateAiAnalysis(fileId, locale);

      if (result.success) {
        // 分析成功，显示成功提示
        alert(t('ai_analysis.success') + ': ' + t('ai_analysis.success_description'));

        // 重定向到AI分析结果页面
        router.push(`/ai-insight-result?fileId=${fileId}`);
      } else {
        // 分析失败，显示错误提示
        alert(t('ai_analysis.failed') + ': ' + (result.message || t('ai_analysis.failed_description')));
      }
    } catch (error) {
      // 处理错误
      console.error('AI分析错误:', error);
      alert(t('ai_analysis.error') + ': ' + (error instanceof Error ? error.message : t('ai_analysis.error_description')));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleAiAnalysis}
      disabled={isAnalyzing}
      className={`${className} bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700`}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('ai_analysis.analyzing')}
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          {t('ai_analysis.generate')}
        </>
      )}
    </Button>
  );
};

export default AiAnalysisButton;
