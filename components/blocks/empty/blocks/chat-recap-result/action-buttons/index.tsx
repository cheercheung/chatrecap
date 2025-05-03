"use client";

import React from 'react';
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { ActionButtonsProps } from './types';

/**
 * Action Buttons Component
 * 
 * Provides navigation and action buttons for the chat recap result page,
 * including back, export, and share functionality.
 */
const ActionButtonsBlock: React.FC<ActionButtonsProps> = ({ className }) => {
  const t = useTranslations("chatrecapresult");
  const router = useRouter();
  
  // Handle back button click
  const handleBack = () => {
    router.push("/chatrecapanalysis");
  };
  
  // Handle export button click (placeholder)
  const handleExport = () => {
    alert(t("export_not_implemented"));
  };
  
  // Handle share button click (placeholder)
  const handleShare = () => {
    alert(t("share_not_implemented"));
  };
  
  return (
    <div className={`flex justify-between items-center mb-8 ${className}`}>
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        {t("back_to_upload")}
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {t("export_pdf")}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          {t("share_results")}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtonsBlock;
