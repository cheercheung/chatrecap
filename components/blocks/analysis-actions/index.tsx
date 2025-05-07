'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import AiAnalysisButton from './ai-analysis-button';

interface ActionButtonsProps {
  fileId?: string;
  className?: string;
}

/**
 * 分析结果页面的操作按钮组件
 * 包括返回、导出、分享和AI分析按钮
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ fileId, className }) => {
  const t = useTranslations('chatrecapresult');
  const { toast } = useToast();

  // 处理导出PDF
  const handleExportPDF = () => {
    toast({
      title: t('export_not_implemented'),
      description: '',
    });
  };

  // 处理分享结果
  const handleShareResults = () => {
    toast({
      title: t('share_not_implemented'),
      description: '',
    });
  };

  return (
    <div className={`flex flex-wrap gap-2 mb-6 ${className}`}>
      {/* 返回按钮 */}
      <Link href="/chatrecapanalysis">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('components.action_buttons.back_to_upload')}
        </Button>
      </Link>

      {/* 导出PDF按钮 */}
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <Download className="mr-2 h-4 w-4" />
        {t('export_pdf')}
      </Button>

      {/* 分享结果按钮 */}
      <Button variant="outline" size="sm" onClick={handleShareResults}>
        <Share2 className="mr-2 h-4 w-4" />
        {t('share_results')}
      </Button>

      {/* AI分析按钮 - 仅当提供了fileId时显示 */}
      {fileId && <AiAnalysisButton fileId={fileId} />}
    </div>
  );
};

export default ActionButtons;
